---
name: merge
version: 1.0.0
description: Resolve residual reconcile conflicts by hand. Use when "Prepare to land" / `tiny-brain reconcile-branch` reported a `conflicts` outcome — the deterministic ladder (rerere + recipes) and the headless agent could not resolve a rebase conflict, and a human rung is needed to land the branch.
allowed-tools: Read, Edit, Bash(git:*), Bash(tiny-brain:*)
---

# Merge Hand-off Skill (`/merge`)

The **human rung** of the reconcile ladder (worktree-landing-strip F5). When
`tiny-brain reconcile-branch <branch>` — or the dashboard's "Prepare to land" —
returns `conflicts`, the deterministic resolvers (git rerere, the generated-artifact
recipes) and the headless agent all failed on a rebase conflict. This skill opens
the branch's own worktree, reproduces the paused rebase, primes you with the same
conflict context the agent got, and walks the resolution through to a verified,
ready-to-land branch.

## When to Use

- A reconcile / "Prepare to land" reported **`conflicts`** with a list of residual files.
- You want to resolve those conflicts by hand and land the branch.

Do **not** use this for a clean branch — run `tiny-brain reconcile-branch <branch>`
first; only reach for `/merge` once it reports `conflicts`.

## What this does

The `conflicts` outcome means the ladder already **aborted and restored** the
branch to its pre-reconcile tip (via the `backup/<branch>-pre-reconcile` ref), so
the worktree is currently clean. This skill re-runs the *exact* rebase the ladder
runs so it pauses on the conflict, then hands it to you.

**Important — a raw rebase is NOT the full ladder.** The automated ladder resolves
each pause with *two* deterministic rungs before it ever reaches a human: `git
rerere` (git config — it DOES replay in a raw rebase) **and** the generated-artifact
recipes (service code — it does **not**). So the raw rebase in Step 2 surfaces a
**superset** of conflicts: the genuine source conflicts you're here to resolve,
*plus* recipe-covered generated files (lockfiles, `dist/`, `.tiny-brain/analysis.json`
+ `tech/`) that the ladder would have taken-theirs automatically. You must therefore
**classify** each conflicted file (Step 3) and apply the recipe treatment to the
generated ones yourself — never hand-merge them.

Resolving the genuine source conflicts here also **teaches git rerere**: with
rerere enabled (the repo's bootstrap sets `rerere.enabled` + `autoUpdate`), your
resolution is recorded, so a future reconcile of the same conflict replays it
automatically. This is exactly why the classification matters: if you hand-merge a
generated file, rerere records that *wrong* resolution and replays it ahead of the
recipe on the next reconcile — permanently defeating the take-theirs recipe. Taking
theirs (below) records the same resolution the recipe would, so rerere stays correct.

## Inputs

- `<branch>` — the worktree branch that reported conflicts (e.g. `fix/flaky`).
- `<base>` — the trunk it reconciles onto. Defaults to `main`.

## Workflow

### Step 1 — Locate the branch's worktree, and check it is not mid-rebase

The rebase and every resolution run **inside the branch's own checkout**, never the
main repo (a two-arg `rebase <base> <branch>` operates on that checkout). Find it:

```bash
git worktree list --porcelain
```

Take the `worktree <path>` whose `branch refs/heads/<branch>` matches. Call it
`$WT`. If no worktree holds the branch, stop — there is nothing to open; the branch
must be checked out in a worktree.

Then confirm no rebase is already in progress there — Step 2 would fail with
"already a rebase-merge directory" and leave you stuck:

```bash
git -C "$WT" rev-parse --verify --quiet REBASE_HEAD && echo "REBASE IN PROGRESS"
```

If it prints `REBASE IN PROGRESS`, a previous attempt is paused. Either resume this
skill from **Step 3** on that existing rebase, or clear it first with
`git -C "$WT" rebase --abort`. Do not start a fresh rebase over one already running.

### Step 2 — Reproduce the paused conflict

Run the ladder's rebase, hooks off, in the worktree. It exits non-zero and pauses
on the first conflict (the flags match the core reconcile service exactly, so you
reproduce the *same* rebase, not a differently-shaped one):

```bash
git -C "$WT" -c core.hooksPath=/dev/null rebase --autostash --empty=drop <base> <branch>
```

Hooks stay **off** (`-c core.hooksPath=/dev/null`) so the replay does not pay the
per-commit hook cost — the same reason the ladder does it.

### Step 3 — At each pause, classify the conflicted files

List this pause's conflicts and both sides' intent (re-run this at **every** pause —
`HEAD` is the current pause's landing point, which changes as commits replay):

```bash
git -C "$WT" diff --name-only --diff-filter=U               # the conflicted paths
git -C "$WT" log -1 --format='applying: %s' REBASE_HEAD     # the commit being replayed (theirs)
git -C "$WT" log -1 --format='onto:     %s' HEAD            # what it lands onto right now (ours)
```

Split those paths into two buckets — this is the classification the automated
ladder's recipes (`conflict-recipes.ts`) apply, mirrored here because a raw rebase
does not run them:

- **Generated / derived — take THEIRS, never hand-merge** (a textual merge of a
  derived file is never correct):
  - dependency lockfiles: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`
  - the regenerable committed state: `.tiny-brain/analysis.json` and anything under `.tiny-brain/tech/`
  - build output: any path with a `dist/` or `build/` segment (unless it sits under
    `src/`, `lib/`, `test/`, `tests/`, `__tests__/` — those are source, not artefacts)
- **Everything else — genuine source, hand-merge** (Step 4b). Note the AUTHORED
  `.tiny-brain/config.json` and `.tiny-brain/workers.yaml` are source here, NOT
  generated — the ladder deliberately excludes them from take-theirs (it would drop
  main's authored edits), so hand-merge those.

### Step 4a — Generated files: take theirs

For each generated/derived path, take the branch's version and stage it — the same
`checkout --theirs` + `add` the recipe rung runs. The content is disposable and is
rebuilt downstream (the next package-manager install / `tiny-brain analyse` /
build), so do NOT try to regenerate it mid-rebase:

```bash
git -C "$WT" checkout --theirs -- <file>
git -C "$WT" add <file>
```

### Step 4b — Source files: hand-merge

For every remaining (source) path, open it under `$WT`, integrate **both** sides of
the change (never blindly take one side), remove the conflict markers, then stage:

```bash
git -C "$WT" add <file>
```

Resolve **only** — do not `git commit` and do not `git rebase --continue` yet.

### Step 5 — Continue the rebase

Once every conflicted path is staged (both buckets), continue (hooks still off):

```bash
git -C "$WT" -c core.hooksPath=/dev/null rebase --continue
```

A multi-commit branch can pause again on a later commit. If it does, **loop back to
Step 3** for the new conflict — re-classify from scratch. Repeat until the rebase
completes.

### Step 6 — Verify it lands

Re-run the reconcile verb with the **same `<base>`** you rebased onto (it must not
have moved between Step 2 and here — a base that advanced re-opens the reconcile).
The branch is now rebased onto that base, so the ladder finds it clean and runs the
verification rung (build + tests):

```bash
tiny-brain reconcile-branch <branch>
```

Note this re-runs the *whole* ladder, not just verification: it rebases again and,
if any pause recurs, replays your just-recorded rerere resolutions — so the tip it
verifies is the ladder's, re-derived from your resolutions, not the literal tip you
left. That is expected and desirable (it proves the resolutions replay cleanly).

- `ready to land` (exit 0) — done. The branch is reconciled and verified; land it
  from the dashboard or your normal flow.
- `conflicts` again — a further conflict surfaced (e.g. the base moved); loop back
  to Step 2.
- `failed` — it rebased clean but the build/tests failed; fix those on the branch,
  then re-run this step.

## Escape hatch

If the conflict cannot be reconciled, abort — this restores the branch to where it
was before you started:

```bash
git -C "$WT" rebase --abort
```

The branch's pre-reconcile state is also preserved at `backup/<branch>-pre-reconcile`
until the work lands, so nothing is lost.

## Constraints

- **Operate in `$WT`, not the main repo** — use `git -C "$WT" …` for every git
  command and edit files under `$WT`.
- **Hooks off for rebase / continue** — always pass `-c core.hooksPath=/dev/null`
  on the rebase and each `--continue`; `-c` is per-invocation, not inherited.
- **Resolve and stage only** during the rebase — the `--continue` finalises each
  commit; never `git commit` by hand mid-rebase.
- **Don't delete the backup ref** — `backup/<branch>-pre-reconcile` is the undo
  point and must survive until the work lands.
