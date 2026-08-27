<!--
BODY-STRUCTURE REFERENCE for the /fix skill — NOT a file to copy.

`tiny-brain work add fix <slug> "<title>"` CREATES docs/fixes/<slug>.md with the
frontmatter already written: id, uuid, title, status, severity, reported,
resolved. The CLI owns the frontmatter — do NOT add or hand-edit it, and never
type a `uuid:` or a `reported:` timestamp. Status is GIT-DERIVED: never read or
edit any `status:` line, in the frontmatter or in a task block — nothing reads
it, and the pipeline projects the real status from commits. (On completion you
DO add `resolved:` and a `resolution:` block — see the bottom of this
reference.)

Tasks are created with `tiny-brain work add task --fix <slug> "<description>"`, which
appends each task block with its own generated uuid. Do NOT hand-author task
blocks, `task-N` ids, per-task `status:` lines, or `commitSha` lines — commits
are joined to tasks by the `Task-Uuid:` trailers the commit-msg hook stamps,
never by anything you write into the markdown.

A task DESCRIPTION is the match key for every future commit's `Task:` header —
treat it as FROZEN once its first commit lands (reword only via supersede +
re-add), and write it as plain prose: no backticks, backslashes, or quotes.

The guiding rule for every section: the spec's job is CONTEXT TRANSFER to a
bounded worker. Author-time discovery is cheap; worker-time discovery is
expensive and where fabrication happens. Pin what you learned — file:line,
symbols, commands — so the worker never re-derives it.

The CLI scaffold is minimal — it renders `## Issue Summary`, `## Reproduction`,
and a `## Tasks` placeholder. The richer sections below (Root Cause Analysis,
Test Plan, Resolution, …) are ones you ADD with the Edit tool; this reference
shows the target shape. Delete any section that doesn't apply.
-->

# Fix: [Title]

## Issue Summary

### Reproduction Steps

<!-- A reproduction is a TRANSCRIPT, not steps-in-theory: the command you
     actually ran and the output you actually observed (trimmed). End with a
     `Verified:` line — `yes (output above)` or `not reproduced — tried X, Y`.
     Both are legitimate states; only an UNDECLARED one is dangerous. -->

1. Run: `<exact command>`
2. Observe: `<trimmed actual output>`

**Verified:** yes — output above / not reproduced (tried …)

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens — quote the observed output, don't paraphrase it]

## Root Cause Analysis

<!-- IMPORTANT: Do NOT use "### N." numbered headings outside the ## Tasks section.
     sync-file parses "### N. Title" as task definitions. Using them here will
     create duplicate task IDs. Use **bold text** or unnumbered ### headings instead.

     EVIDENCE RULE — file:line or it didn't happen: every claim about how the
     code behaves today cites `path/to/file.ts:line`. A diagnosis with no
     citations is a hypothesis, not an RCA. Also record ONE rejected
     alternative: the other cause you considered and the evidence that ruled it
     out — the residue that proves the diagnosis process ran. -->

[Why the bug occurs — specific code path, cited. e.g. "`run-stream.routes.ts:1006`
folds mainHealth over `all`, but `useRepoRuns.ts:203` never re-fetches …"]

**Rejected alternative:** [the cause considered and the evidence that ruled it
out — e.g. "not the record scan: 374 records parse in 38ms; cost scales with
page size, not record count".]

### Affected Files

<!-- Every path VERIFIED to exist (you opened it), or tagged NEW with the
     directory convention that places it there. Guessed paths send workers to
     the wrong layer. -->

- `path/to/affected/file.ts` — [what's wrong here, one clause]
- `path/to/new/file.ts` (NEW — [why this directory])

## Deliverability

[This fix should be **one worker run**. Declare what affects delivery — full rules in
`docs/deliverability-rubric.md`.]

- **Single-run fit:** [one bounded fix? If it needs several independent slices, it's a PRD, not a fix.]
- **Environment requirements:** [new dependencies, network, external services, Docker, global tools — blank if none.]
- **File contention:** [open fixes/features touching the same files — sequence or merge, say which; blank if none.]
- **Base expectation:** [what must already be true of main when the worker starts (a landed seam, a config key). If an expected seam is absent, the worker STOPS and reports — it never fabricates it.]

## Test Plan

<!-- Populate from READING the real test files, not from imagination:
     - Regression rows name test files verified to exist.
     - Amended rows name the ACTUAL case (it-string) whose expectation changes.
     - New rows are the RED tests, written as the it-strings the worker will
       paste — this makes the RED phase mechanical.
     Include the exact verify command: a SINGLE vitest invocation
     (`npx vitest run <file>`), never parallel. -->

### 🔒 Regression Tests (must pass unchanged)
| File | Cases | Status |
|------|-------|--------|
| packages/…/__tests__/real-file.test.ts | 'existing case name' (+ siblings) | ❌ |

### ✏️ Amended Tests (expectations will change)
| File | Case | Change | Status |
|------|------|--------|--------|
| packages/…/__tests__/real-file.test.ts | 'actual it-string' | [what the expectation becomes, and why] | ❌ |

### 🆕 New Tests (to be added)
| File | Case | Status |
|------|------|--------|
| packages/…/__tests__/real-file.test.ts | 'the failing it-string to write first' | ❌ |

**Verify with:** `npx vitest run <path/to/file.test.ts>` (single invocation — never parallel)

## Tasks

<!--
  Tasks are created with `tiny-brain work add task --fix <slug> "<description>"`.
  Each task is ONE complete TDD cycle: failing test + implementation + any
  refactors triggered by review, all under the same task.

  - DO NOT split into "Write test for X" + "Implement X" — that's half a
    cycle each.
  - DO NOT add manual / verification-only tasks (e.g. "User checks the
    dashboard", "Run tests"). They produce no commit and always end up
    superseded.
  - DO bundle tests with the behaviour they cover.
  - Descriptions are plain prose (no backticks/backslashes/quotes) and FROZEN
    once work starts.

  Under each created task heading, add the detail block the worker executes
  from — files (verified or NEW), the observable done-signal, and the first
  failing test:

  **Files:** `path/to/file.ts`, `path/to/__tests__/file.test.ts`
  **First failing test:** 'the it-string the RED commit adds'
  **Done when:** [observable input→output outcome a reviewer can point at]
-->

## Resolution

When all tasks are complete, add to the YAML frontmatter (leave `id` / `uuid` /
`status` exactly as written — status is git-derived and never edited):
1. Set `resolved:` to ISO timestamp (e.g., `2026-01-21T15:30:00.000Z`)
2. Add a `resolution:` object with **exactly** the keys `rootCause`, `fix`
   (array), and `filesModified` (array) — any extra key breaks the resolution
   extractor and hides the doc
3. Run `tiny-brain task sync docs/fixes/{fix-id}.md`

## Lessons Learned

[Optional: What can we do to prevent similar issues?]

- Lesson 1
- Lesson 2
