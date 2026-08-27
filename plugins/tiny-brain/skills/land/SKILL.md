---
name: land
version: 1.0.0
description: Land a completed work item onto its target branch. Use when a fix / PRD / feature is fully completed — the post-commit hook printed "→ ready to land; run /land" — and you want to resolve its frontier, reconcile, merge, and reap its attachments through `tiny-brain land`.
allowed-tools: Read, Bash(tiny-brain:*)
---

# Land a Work Item (`/land`)

The thin interactive layer over the deterministic `tiny-brain land` pipeline
(land-work-item F2). **This skill is a wrapper, not logic** — it resolves the
effective config, shows the plan, **confirms** before the outward-facing
merge/push, invokes `tiny-brain land`, and reports the outcome verbatim. No git
logic lives here; every mutation is `tiny-brain land`'s.

Landing is an *event*, not a view: readiness is computed once, from live git, at
the moment you land — then the item's attachments are torn down. The noun is the
**work item**, not the branch: a fix/PRD/feature is landable because its tasks are
completed, regardless of where its commits live (local branch, remote, scattered
worktrees).

## When to Use

- A fix / PRD / feature is **fully completed** (the post-commit hook printed
  `→ ready to land; run /land`, or the work board shows it in the In-review lane).
- You want to reconcile its frontier onto the target branch, merge it, and reap
  its worktrees / branches / run records.

Do **not** hand-run `git merge` / `git rebase` to land — that is exactly the
git-chasing this pipeline replaces. Always go through `tiny-brain land`.

## Inputs

The work ref, one of:

- `--fix <slug>` — a fix.
- `--prd <slug>` — a whole PRD.
- `--feature <slug> --prd <slug>` — a single feature within a PRD.

## Workflow

### Step 1 — Resolve and show the plan

Landing is outward-facing, so show the resolved plan **before** doing anything.
Read the effective target branch (F3 cascade: repo `.tiny-brain/config.json` over
your global over the built-in default `main`) — `tiny-brain land` honours it:

```bash
tiny-brain config preferences get landTargetBranch   # target branch (default main)
```

Then tell the user, in plain terms, the plan:

- **Item**: the fix/PRD/feature being landed.
- **Onto**: the resolved target branch (a `--branch <branch>` flag overrides it).
- **Strategy**: a **merge commit** onto the target branch.
- **After a successful land _or_ an already-delivered no-op**: `tiny-brain land`
  reaps the item's attachments — its worktrees, local branches, and run records.
  The reap is **local-only** on this build: remote-branch teardown is deferred to
  F5 and not yet wired, so never tell the user a remote branch was removed.

### Step 2 — Confirm before landing

Landing merges onto the target branch and may push — it needs explicit intent.
**Stop and get the user's confirmation** before Step 3. Do not proceed on
assumption; a single "yes, land it" is enough.

### Step 3 — Land

Run the pipeline for the confirmed ref (add `--branch <branch>` only to override
the resolved target):

```bash
tiny-brain land --fix <slug>
# or: tiny-brain land --prd <slug>
# or: tiny-brain land --prd <slug> --feature <slug>
```

`tiny-brain land` resolves the frontier across local **and** remote refs →
reconciles it → merges onto the target → marks it landed → reaps the attachments.
It never lands a partial set and never pushes without the reconcile succeeding.

### Step 4 — Report the outcome verbatim

Relay `tiny-brain land`'s result exactly — do not reinterpret it:

| Outcome | Meaning | Next step |
|---|---|---|
| **✅ landed** | Reconciled, merged onto the target, and reaped. | Done. |
| **✅ already delivered** | The item's work is already on the target (a re-run / squash). Nothing is merged — but the item's attachments are still reaped. | Done. |
| **⚠️ divergent frontier** | The completed work is split across refs with no single ref carrying all of it. Nothing is merged; the split refs are listed. | Surface the listed refs to the user. There is **no single-command remedy on this build** — consolidating divergent refs into one ref is owned by remote-frontier-recon / the conflict agent (not yet on main). Do **not** prescribe `tiny-brain reconcile-branch <ref>`: it reconciles one ref onto base, not several refs together, so it cannot fix divergence. The work must reach a single ref before `/land` can proceed. |
| **⚠️ conflicts** | Reconcile could not land cleanly. Nothing is merged. | Run `tiny-brain reconcile-branch <ref>`; if **that** reports conflicts, resolve by hand (`/merge`). Then re-run `/land`. |
| **∅ nothing to land** | No local ref carries all of the item's completed work. | Nothing to land — finish the work first, or consolidate a split frontier onto one ref. |
| **❌ failed** | A land step errored; nothing landed. | Read the reported reason, fix it on the branch, and re-run `/land`. |
| **⏳ not yet complete** | `tiny-brain land` printed `land pipeline not yet complete: <error>`. This comes from a **generic catch-all** — it is ANY runtime error thrown during land, not evidence of an unbuilt step. Nothing was mutated. | Report the printed `<error>` to the user verbatim and stop. Diagnose it as a genuine failure to investigate, not a feature that "needs finishing". |

If the reap surfaces a best-effort teardown failure, tell the user a re-run of
`/land` finishes the cleanup — reap is idempotent.

## Constraints

- **No git logic in this skill.** Never `merge` / `rebase` / `push` by hand —
  `tiny-brain land` owns every mutation. The skill only reads config, confirms,
  and shells to the CLI.
- **Confirm before landing.** The merge/push is outward-facing; never land without
  explicit user intent.
- **Report the CLI outcome verbatim.** landed / already-delivered / divergent /
  conflicts / nothing-to-land / failed — relay it as-is; the conflict rung is
  `tiny-brain reconcile-branch` (with `/merge` as its human fallback), not this skill.
