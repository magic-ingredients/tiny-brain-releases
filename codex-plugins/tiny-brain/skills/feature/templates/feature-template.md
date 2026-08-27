<!--
BODY-STRUCTURE REFERENCE for the /feature skill — NOT a file to copy.

`tiny-brain work add feature --prd <prd-slug> <slug> "<title>"` CREATES the feature file
with the frontmatter already written: id, uuid, prd_id, number, status, dates.
The CLI owns the frontmatter — do NOT add or hand-edit it, and never type a
`uuid:` or a `number:`.

Tasks are created with `tiny-brain work add task --feature <slug> "<description>"`, which
appends each task block with its own generated uuid (add `--prd <prd-slug>` only
to disambiguate a feature slug shared across PRDs). Do NOT hand-write task
blocks, per-task `status:`/SHA lines, or `task-N-M` ids — those are obsolete
under the UUID identity model.

This template shows the PROSE SECTIONS to flesh out with the Edit tool after the
file exists. Delete any section that doesn't apply.
-->

# Feature: [Feature Title]

## Description

[What does this feature deliver, why is it needed, and how does it fit the PRD?]

## Acceptance Criteria

- [ ] Criterion 1: [Specific requirement]
- [ ] Criterion 2: [Specific requirement]

## Deliverability

[This feature should be **one worker run**. Declare what affects delivery — full rules in
`docs/deliverability-rubric.md`.]

- **Single-run fit:** [one worker run? If not, how it splits — see `docs/deliverability-rubric.md` for sizing.]
- **Environment requirements:** [new dependencies, network, external services, Docker, global tools — blank if none.]

[Cross-feature seams and ordering go under **Dependencies** below.]

## Tasks

[Tasks are created via `tiny-brain work add task` — one per behaviour, full TDD cycle
inside (never a "write failing tests" / "implement" split, never a
verification-only task). Flesh out each created task's description and the files
it touches.]

**Files to modify/create (per task):**
- `path/to/file1.ts`
- `path/to/file2.ts`

## Test Plan

[Categorise the tests this feature touches. 🔒 regression (pass unchanged),
✏️ amended, 🆕 new case in an existing file, 📄 new file.]

### 🔒 Regression Tests
| File | Cases | Status |
|------|-------|--------|
| src/__tests__/existing.test.ts | all existing | ❌ |

### 🆕 New Tests
| File | Case | Status |
|------|------|--------|
| src/__tests__/feature.test.ts | handles new feature | ❌ |

## Dependencies

- **Feature/System 1**: [Description of dependency]

## Implementation Notes

- Note 1: [Important consideration]
