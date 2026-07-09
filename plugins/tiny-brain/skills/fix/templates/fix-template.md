<!--
BODY-STRUCTURE REFERENCE for the /fix skill — NOT a file to copy.

`tb work add fix <slug> "<title>"` CREATES docs/fixes/<slug>.md with the
frontmatter already written: id, uuid, title, status, severity, reported,
resolved. The CLI owns the frontmatter — do NOT add or hand-edit it, and never
type a `uuid:` or a `reported:` timestamp. (On completion you DO add `resolved:`
and a `resolution:` block — see the bottom of this reference.)

Tasks are created with `tb work add task --fix <slug> "<description>"`, which
appends each task block with its own generated uuid. AT CREATION TIME do NOT
hand-author task blocks or `task-N` ids. (Later, during implementation, you DO
edit a task block's `status:` and paste its `commitSha` per the skill's
per-commit ceremony — that is the lifecycle, not creation.)

The CLI scaffold is minimal — it renders `## Issue Summary`, `## Reproduction`,
and a `## Tasks` placeholder. The richer sections below (Root Cause Analysis,
Test Plan, Resolution, …) are ones you ADD with the Edit tool; this reference
shows the target shape. Delete any section that doesn't apply.
-->

# Fix: [Title]

## Issue Summary

### Reproduction Steps
1. Step to reproduce
2. Step to reproduce
3. Observe the bug

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

## Root Cause Analysis

<!-- IMPORTANT: Do NOT use "### N." numbered headings outside the ## Tasks section.
     sync-file parses "### N. Title" as task definitions. Using them here will
     create duplicate task IDs. Use **bold text** or unnumbered ### headings instead. -->

[Explain why this bug occurs. Be specific about the code path and logic error.]

### Affected Files
- `path/to/affected/file.ts`
- `path/to/another/file.ts`

## Deliverability

[This fix should be **one worker run**. Declare what affects delivery — full rules in
`docs/deliverability-rubric.md`.]

- **Single-run fit:** [one bounded fix? If it needs several independent slices, it's a PRD, not a fix.]
- **Environment requirements:** [new dependencies, network, external services, Docker, global tools — blank if none.]

## Test Plan

### 🔒 Regression Tests (must pass unchanged)
| File | Cases | Status |
|------|-------|--------|
| path/to/test.ts | all existing | ❌ |

### ✏️ Amended Tests (expectations will change)
| File | Case | Change | Status |
|------|------|--------|--------|
| path/to/test.ts | specific case | Description of change | ❌ |

### 🆕 New Tests (to be added)
| File | Case | Status |
|------|------|--------|
| path/to/test.ts | new case for fix | ❌ |

## Tasks

<!--
  Tasks are created with `tb work add task --fix <slug> "<description>"`.
  Each task is ONE complete TDD cycle: failing test + implementation + any
  refactors triggered by review, all under the same task.

  - DO NOT split into "Write test for X" + "Implement X" — that's half a
    cycle each.
  - DO NOT add manual / verification-only tasks (e.g. "User checks the
    dashboard", "Run tests"). They produce no commit and always end up
    superseded.
  - DO bundle tests with the behaviour they cover.

  Flesh out each created task's description and the files it touches.
-->

**Files to modify/create (per task):**
- `path/to/__tests__/file.test.ts`
- `path/to/file.ts`

## Resolution

When all tasks are complete, update the YAML frontmatter (the only frontmatter
edit the model makes — leave id/uuid as written):
1. Set `status: completed`
2. Set `resolved:` to ISO timestamp (e.g., `2026-01-21T15:30:00.000Z`)
3. Add `resolution:` object with `rootCause`, `fix` (array), and `filesModified` (array)
4. Run `tiny-brain task sync docs/fixes/{fix-id}.md`

## Lessons Learned

[Optional: What can we do to prevent similar issues?]

- Lesson 1
- Lesson 2
