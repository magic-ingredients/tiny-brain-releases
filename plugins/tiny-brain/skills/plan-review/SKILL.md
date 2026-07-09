---
name: plan-review
version: 1.0.0
description: Review a PRD or fix for worker-deliverability against the deliverability rubric. Use when the user wants to check whether a plan's features can each be delivered by a worker, or runs /plan-review.
allowed-tools: Read, Task, Bash(tiny-brain:*), Bash(tb:*)
---

# Deliverability Review Skill

## When to Use

Run this to check whether a PRD or fix is **worker-deliverable** — on demand, at any time,
against work that already exists. It is the same review the `/plan` and `/feature` skills
run automatically at author time, exposed as a standalone command so a plan can be
re-checked as it evolves (the verdict goes stale when the plan changes).

## Input

The user names a PRD or fix by slug (e.g. `/plan-review my-prd-slug`). If no slug is given,
ask which PRD or fix to review, or list the candidates:

```bash
tb work --kind prd --status all
```
```bash
tb work --kind fix --status all
```

## Workflow

Dispatch the `deliverability-reviewer` agent with the Task tool
(`subagent_type: deliverability-reviewer`).

For a PRD:

```
Review the deliverability of:
- PRD: <slug>
```

For a fix:

```
Review the deliverability of:
- Fix: <slug>
```

The agent fetches the authored markdown, reads `docs/deliverability-rubric.md` and
`ARCHITECTURE.md`, runs the eight rubric lenses, and returns a structured verdict. It is
report-only — it never edits the plan and never touches the commit pipeline.

## Reporting the result

Surface the agent's result to the user:

- the `verdict` — `deliverable`, `needs-rework`, or `not-reviewable`;
- for `needs-rework`, the `findings` (what to reshape and why) and the per-feature
  `featureScorecard` (single-run fit, clarity, collisions, implied dependencies, new
  dependencies, environment requirements);
- for `not-reviewable`, the reason (usually a missing or unparseable doc).

You and the user decide what to change — the review informs, it does not rewrite the plan.
The full rules it judges against live in `docs/deliverability-rubric.md`.
