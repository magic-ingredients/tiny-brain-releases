---
name: plan-review
version: 1.0.0
description: Re-run a plan's authoring-time planning reviews and record the verdicts — deliverability for a PRD or fix, plus architecture-alignment for a PRD. Use when the user wants to re-check a plan's readiness, or runs /plan-review.
---

# Planning Review Skill

## When to Use

Run this to re-check a PRD or fix against its **planning gates** — on demand, at any time,
against work that already exists. It runs the same reviews `/plan` and `/fix` run at author
time (deliverability for either; architecture-alignment additionally for a PRD) and records
each verdict at the target's current authoring sha, so a plan's planning-checks row reflects
the latest doc. The verdict goes stale automatically when the doc changes (a new authoring
sha).

## Input

The user names a PRD or fix by slug (e.g. `/plan-review my-prd-slug`). If no slug is given,
ask which PRD or fix to review, or list the candidates:

```bash
tiny-brain work --kind prd --status all
```
```bash
tiny-brain work --kind fix --status all
```

## Workflow

### 1. Resolve the authoring sha

The verdicts attach to the target at its **current authoring sha** — the last commit that
touched the doc:

```bash
# PRD:
git log -1 --format=%H -- docs/prd/<slug>/
# Fix:
git log -1 --format=%H -- docs/fixes/<slug>.md
```

### 2. Dispatch the reviewers (Codex agent delegation — neither agent edits the doc or persists; you persist their verdicts in step 3)

Always run the **deliverability** review (`Codex role: matching specialist reviewer`):

```
Review the deliverability of:
- PRD: <slug>          (or: - Fix: <slug>)
```

For a **PRD** target, **also** run the **architecture-alignment** review
(`Codex role: architecture-reviewer`) — a PRD carries a `## Architecture Alignment`
section; a fix does not, so a fix gets deliverability only:

```
Review the architecture alignment of:
- PRD: <slug>
```

The deliverability agent reads `docs/deliverability-rubric.md` + the plan and runs the
rubric lenses; the architecture agent reads `ARCHITECTURE.md` + the ADRs + the plan's
`## Architecture Alignment` section. Each returns a structured verdict.

### 3. Persist each verdict at the authoring sha

Map the agent's verdict to a pipeline `ReviewVerdict` and replace the JSON's `verdict`
field with the mapped value (keep `summary` — persist requires it):

| agent verdict | persist verdict |
|---|---|
| `deliverable` / `aligned` | `clean` |
| `needs-rework` | `needs-refactoring` |
| `not-reviewable` | **do not persist** — the gate stays "not assessed" |

```bash
tiny-brain _review persist deliverability --planning --sha <authoring-sha> --prd <slug> --json-file <deliverability.json>
# PRD only:
tiny-brain _review persist architecture-alignment --planning --sha <authoring-sha> --prd <slug> --json-file <architecture.json>
```

For a fix target, use `--fix <slug>` and persist deliverability only.

> ⚠️ **Never persist the agent's raw verdict.** `deliverable` / `aligned` / `needs-rework`
> are not valid `ReviewVerdict`s, and `parsePersistedReview` silently coerces any unknown
> to `clean` — so a `needs-rework` review would fold as **passed**. Map first.

## Rounds and exit criteria

A review round is one dispatch-and-persist pass. Rounds exist to reshape a plan,
not to polish it — so the loop is bounded.

- **Default cap: three rounds** per target. Rounds 1–3 are where real design
  defects surface and get fixed. A **fourth** round needs a stated reason in the
  commit message that opens it (what design defect, not residue, justifies
  another pass); anything past the fourth needs the user.

- **One exit criterion: a round with no finding above `low`.** Both reviewers
  cap every `consistency` (residue) finding at `low`, so a round whose findings
  are all `low` is residue-only — the plan is deliverable. When you reach it: fix the residue,
  commit it, **acknowledge the hook's `planning reviews owed` line without
  running another round**, and stop. The `owed` message is correct (a review is
  owed at the new sha) but the skill, not the hook, decides whether to run one —
  and the exit criterion says not to.

- **Verdicts are persisted at the sha the reviewer read** (step 3), never at a
  later commit. A residue-only commit made after the exit round therefore shows
  "not assessed" on the plan card's planning-checks row — a known, accepted
  consequence until verdict carry-forward exists.

- **Re-run only the dirty gate.** When one gate is already clean at the current
  authoring sha (e.g. architecture returned `aligned` while deliverability still
  has design findings), the next round re-runs only the dirty gate. Do not
  re-dispatch a gate that already passed at this sha.

- **At the cap, stop and ask the user.** If three rounds have not reached the
  exit criterion, do not open a fourth on your own judgement — stop and ask the
  user how to proceed (accept the known findings and dispatch, reshape further,
  or split the work).

## Reporting the result

Surface each agent's result to the user:

- the `verdict` — deliverability `deliverable` / `needs-rework` / `not-reviewable`;
  architecture `aligned` / `needs-rework` / `not-reviewable`;
- for a rework, the `findings` and (deliverability) the per-feature `featureScorecard`;
- for `not-reviewable`, the reason (usually a missing or unparseable doc).

You and the user decide what to change — the reviews inform, they don't rewrite the plan.
The persisted verdicts drive the plan card's planning-checks row.
