---
name: plan-review
version: 1.0.0
description: Re-run a plan's authoring-time planning reviews and record the verdicts — deliverability for a PRD or fix, plus architecture-alignment for a PRD. Use when the user wants to re-check a plan's readiness, or runs /plan-review.
allowed-tools: Read, Task, Bash(tiny-brain:*), Bash(tb:*), Bash(git:*)
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

### 2. Dispatch the reviewers (Task tool — neither agent edits the doc or persists; you persist their verdicts in step 3)

Always run the **deliverability** review (`subagent_type: deliverability-reviewer`):

```
Review the deliverability of:
- PRD: <slug>          (or: - Fix: <slug>)
```

For a **PRD** target, **also** run the **architecture-alignment** review
(`subagent_type: architecture-reviewer`) — a PRD carries a `## Architecture Alignment`
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

## Reporting the result

Surface each agent's result to the user:

- the `verdict` — deliverability `deliverable` / `needs-rework` / `not-reviewable`;
  architecture `aligned` / `needs-rework` / `not-reviewable`;
- for a rework, the `findings` and (deliverability) the per-feature `featureScorecard`;
- for `not-reviewable`, the reason (usually a missing or unparseable doc).

You and the user decide what to change — the reviews inform, they don't rewrite the plan.
The persisted verdicts drive the plan card's planning-checks row.
