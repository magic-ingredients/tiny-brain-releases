---
name: fix
version: 2.0.0
description: Create a fix document for bug tracking. Use when user reports a bug or wants to track a fix with full test plan.
---

# Fix Creation Skill

## When to Use

Create a fix document when:
- User reports a bug to investigate
- You identify an issue that needs tracking
- A fix requires multiple steps and test validation
- You want to document root cause analysis

## Identity model: slugs and UUIDs

Every fix and task carries a stable **UUIDv7** as its real identity, which
`tiny-brain work add` generates and stamps into the markdown — you never type one.
Humans and commit messages refer to a fix by its **slug** and to a task by its
**description**, which the tooling resolves to the UUID internally.

So: **create the fix and its tasks through `tiny-brain work add`.** Do not hand-write
`id:` / `uuid:` frontmatter or a `reported:` timestamp — the CLI fills them in.

## Fix Doc Location

Fix docs live under `docs/fixes/` by default. Teams can override this via
the `directories.fixes` key in `.tiny-brain/config.json` — when that key is
set, use the configured path everywhere the steps below say `docs/fixes`.
The quick way to read it:

```bash
tiny-brain config preferences get fixesDirectory
```

If `fixesDirectory` resolves to anything other than `docs/fixes`, substitute
that path in every `docs/fixes/...` reference below.

## Workflow

### Step 1: Investigate the Issue

Before documenting, investigate:
- **Reproduction steps**: How to trigger the bug?
- **Expected behavior**: What should happen?
- **Actual behavior**: What actually happens?
- **Root cause**: Why is this happening?

Use exploration tools (grep, read, etc.) to understand the issue — and **capture
the evidence as you go**, because the doc must carry it:

- **Reproduce for real.** The Reproduction section is a transcript — the command
  you ran and the output you observed — ending in a `Verified:` line. "Not
  reproduced (tried X, Y)" is a legitimate state; an undeclared one is not.
- **file:line or it didn't happen.** Every claim about current behaviour in the
  Root Cause cites `path:line`. A diagnosis with no citations is a hypothesis.
- **Record one rejected alternative** — the other cause you considered and the
  evidence that ruled it out. That residue is the proof the diagnosis ran.

The doc's job is **context transfer to a bounded worker**: discovery is cheap
for you (repo open, bug live) and expensive for the worker — pin what you
learned so it is never re-derived.

### Step 2: Create the fix document

```bash
tiny-brain work add fix <fix-slug> "Brief Description of the Fix"
```

This creates `docs/fixes/<fix-slug>.md` with the frontmatter filled in — `id`,
`uuid`, `title`, `status: not_started`, `severity`, `reported`, `resolved: null`.
The CLI owns the frontmatter; adjust the default `severity` with the Edit tool —
calibrate it rather than leaving the default unexamined: `critical` = data loss /
security / corrupted state · `high` = user-facing breakage or a blocked workflow ·
`medium` = wrong but workaroundable · `low` = cosmetic. The `status:` line is
CLI-written and git-derived — never read or edit it, here or in task blocks.

**Slug naming:** Use descriptive kebab-case:
- `dashboard-not-loading-after-upgrade`
- `progress-json-sync-failing`
- `missing-test-coverage`

### Step 3: Document Root Cause

With the Edit tool, fill in the fix document's prose: clearly explain
1. What the bug is
2. What causes it (root cause)
3. What the fix approach is
4. What tests will validate the fix

**IMPORTANT:** Do NOT use `### N.` numbered headings (e.g., `### 1. Some heading`) outside the `## Tasks` section. The sync-file parser treats `### N. Title` as task definitions — using them in Root Cause Analysis or elsewhere will create duplicate task IDs. Use **bold text** or unnumbered `###` headings instead.

### Step 4: Identify and Document Test Plan

**IMPORTANT:** Before documenting the test plan, you must actively analyze the codebase to identify relevant tests. Do NOT guess - read the actual test files.

#### 4a: Identify Relevant Tests

1. **Find test files for affected code:**
   - Look for test files adjacent to modified source files (e.g., `service.test.ts` next to `service.ts`)
   - Check `__tests__/` directories
   - Search for tests that import the affected modules

2. **Read the test files** to understand:
   - Which test cases exercise the affected code paths
   - Which assertions may need to change based on the fix
   - What new scenarios need test coverage

3. **Categorize each test:**
   - **Regression**: Tests that should continue to pass unchanged (existing behavior preserved)
   - **Amended**: Tests whose expectations need updating (behavior intentionally changed)
   - **New**: Tests that need to be written (new behavior or uncovered edge cases)

#### 4b: Document the Test Plan

Use the emoji schema for test categorization:

| Emoji | Category | Description |
|-------|----------|-------------|
| `🔒` | Regression | Must pass unchanged |
| `✏️` | Amended Case | Existing case to be modified |
| `📝` | Amended File | File with modified expectations |
| `🆕` | New Case | New test case in existing file |
| `📄` | New File | Entirely new test file |

Population rules — the plan is the worker's RED script, so it must be
executable, not indicative:

- Every file path was **verified to exist** in 4a (or the row is a 📄 new file,
  placed by the package's test convention).
- Amended rows name the **actual it-string** whose expectation changes.
- New rows ARE the RED tests — written as the it-strings the worker pastes.
- End with the exact verify command: one `npx vitest run <file>` per file,
  **single invocation, never parallel**.

**Example test plan:**
```markdown
## Test Plan

### 🔒 Regression Tests (must pass unchanged)
| File | Cases | Status |
|------|-------|--------|
| server/routes/__tests__/runs-list.routes.test.ts | 'caps at the 100 most-recent runs' + siblings | ❌ |

### ✏️ Amended Tests
| File | Case | Change | Status |
|------|------|--------|--------|
| server/routes/__tests__/runs-list.routes.test.ts | 'projects each row its OWN work-item titles' | rows become live so the memo assertions still exercise | ❌ |

### 🆕 New Tests
| File | Case | Status |
|------|------|--------|
| server/routes/__tests__/runs-list.routes.test.ts | 'projects ratio only for live rows, never terminal ones' | ❌ |

**Verify with:** `npx vitest run server/routes/__tests__/runs-list.routes.test.ts`
```

### Step 5: Add Tasks

For every unit of behaviour change, run:

```bash
tiny-brain work add task --fix <fix-slug> "Exact task description"
```

Each task block gets its own generated `uuid:`. The task **description** is the
identity used later in commit `Task:` headers.

Each task MUST describe a complete unit of behaviour change — RED + GREEN + any
refactors all roll up to the same task. The TDD cycle happens *within* each
task, not *across* tasks.

**Tasks MUST:**
- Bundle tests with the implementation they cover. The failing-test commit
  (`test:`) and the implementation commit (`fix:`/`feat:`) for the same
  behaviour belong to the SAME task.
- Describe WHAT to build, not HOW.
- Be implementable as a single TDD cycle that yields one `commitSha` (the
  GREEN). Refactors triggered by review still land under the same task.

**Tasks MUST NOT:**
- Be a single TDD phase on their own. NEVER write a task like
  "Write failing test for X" or "Add tests for Y" — that is half a cycle.
  The tests for X belong inside the X task.
- Be manual / verification-only steps. NEVER write a task like
  "User visually verifies in dev dashboard", "Run the test suite", or
  "Check the deploy". Manual checks are part of finishing a task, not a
  task themselves.
- Be `pipelineType: manual`. That shape is real and legitimate — for
  **PRDs**. A fix must not carry one: it is a single deliverable unit,
  so the gate can only sit inside its code work, which is the
  mid-stream human gate the deliverability rubric forbids (rule 6 of
  `docs/deliverability-rubric.md` fails a fix carrying one). If the
  work needs a human gate, split it — the code half stays a fix, and
  the acknowledgement moves to a PRD task or to tracking outside the
  work system. This resolves the contradiction fix
  `fix-skill-manual-task-ban-conflicts-with-agents-md` recorded between
  this ban and AGENTS.md's Shape 2, in favour of PRD-only.

**Anti-patterns to reject if the user asks for them:**

```
# ❌ DO NOT DO THIS — splits one cycle across two tasks
"Write failing test for SSE reconnection"
"Implement SSE reconnection"

# ❌ DO NOT DO THIS — checks that belong inside a task, not beside it
"Visually verify in dev dashboard"
"Run integration tests"
```

Correct shape — one task per behaviour, full TDD cycle inside:
```bash
tiny-brain work add task --fix dashboard-sse-fix "Reproduce and fix the SSE reconnection bug"
```

**Description hygiene (the description IS the commit match key):** write it as
plain prose — no backticks, backslashes, or quotes (the commit-msg hook matches
by string equality; escapes and shell-mangled characters make future `Task:`
headers fail to resolve). And treat it as **frozen once its first commit
lands** — the markdown description is what every later commit's header is
matched against, so a mid-work reword desyncs everything after the edit. To
rename a task, supersede it and add a new one.

#### Write a per-task detail block under each task heading

`tiny-brain work add task` creates a **heading-only** block (`### N. <description>` +
`id:` + `status:`). The dashboard's per-task detail panel renders the prose
written **under each `### N.` task heading**, so a heading-only task shows a
blank panel. After creating the tasks, edit the doc to add a short **per-task
detail** block under each task heading — what to build, the key files, and the
acceptance signal:

```markdown
### 1. Reproduce and fix the SSE reconnection bug
id: 019e7af9-...
status: not_started

Add a failing test that the client reconnects after a dropped connection, then
implement exponential-backoff reconnection.

**Files:** `src/services/SSEClient.ts`, `src/services/__tests__/SSEClient.test.ts`
**First failing test:** 'reconnects with exponential backoff after the stream drops'
**Done when:** the client re-establishes the stream within the backoff window.
```

Every path in **Files:** is verified to exist (you opened it) or tagged `NEW`
with the directory convention that places it; **First failing test:** is the
it-string the RED commit adds — pre-writing it makes the worker's RED phase
mechanical; **Done when:** is the observable outcome a reviewer can point at.

Keep it to a few lines per task — the fix-level `## sections` carry the broader
narrative; this block is the per-task slice the dashboard surfaces. (The parser
ends the metadata block at the first non-`key:` line, so the prose can follow
the `status:` line directly; the blank line above is just for readability.)

### Step 6: Commit Fix Document

Progress state is projected from the markdown automatically (the sync-progress
hook on write). To commit the fix document so it's tracked in git:

```bash
git add docs/fixes/<fix-slug>.md
git commit -m "chore: add fix document for <fix-slug>"
```

For a manual re-sync after external edits:
`tiny-brain task sync docs/fixes/<fix-slug>.md`.

### Step 7: Confirm and Offer Implementation

Tell the user:
> "I've created fix document '{title}' at `docs/fixes/<fix-slug>.md` with {N} tasks."

Then **always ask**:
> "Would you like me to implement this fix now?"

If yes, proceed to implement using the TDD workflow below.

## Resuming an Existing Fix

Picking up a fix someone else created (or that you created in a prior session)
needs **no status edit**. A fix's and a task's status are derived from git —
its `test:` / `fix:` / `refactor:` / `review:` commits — so the dashboard and
`tiny-brain work` report the right state the moment you land a commit. Just start the
next task and commit as normal: there is no `not_started → in_progress`
frontmatter flip to perform, and **no per-commit task-block update** — the
markdown task `status:` is not read by anything.

A task that turns out to be unnecessary is closed with a `supersede:` terminal
commit (`tiny-brain work task supersede`), not a hand-edited `status: superseded`.

## Implementation Workflow

When implementing a fix, follow TDD phases with proper commit tracking.

### Commit Format for Fixes

```
fix(scope): commit title

Fix: {fix-id}
Task: {task description, as it appears in the markdown}

Description of changes...

🤖 Generated by Tiny Brain
```

The `Task:` value is the **task description as it appears in the fix markdown** —
the commit-msg hook resolves it to the task's UUID and stamps a `Task-Uuid:`
trailer onto the commit; that trailer is the **durable join** status is derived
from. Use the exact description: the hook matches by equality (trimming
whitespace only), so a reworded header fails to resolve — copy the heading
verbatim, and never reword the markdown description once commits reference it.

**Multi-Task Fix Commits:**
Related fix tasks that are naturally implemented together can be grouped in a single commit. Each task needs its own `Task:` header:

```
fix(dashboard): resolve SSE reconnection issues

Fix: dashboard-sse-fix
Task: Add retry logic
Task: Fix timeout handling
Task: Update error messages

All SSE-related fixes implemented together...

🤖 Generated by Tiny Brain
```

All tasks in the commit get the same commit SHA in progress tracking.

### TDD Phases

| Phase | Commit Prefix | Description |
|-------|---------------|-------------|
| **RED** | `test:` or `test(scope):` | Write failing tests first |
| **GREEN** | `fix:` or `fix(scope):` | Implement minimum code to pass tests |
| **REFACTOR** | `refactor:` or `refactor(scope):` | Improve code quality (optional) |

### Implementation Steps

1. **RED Phase**: Write failing test
   ```
   test(dashboard): add SSE reconnection test

   Fix: dashboard-sse-fix
   Task: Implement SSE reconnection

   Add test that verifies the SSE client reconnects...

   🤖 Generated by Tiny Brain
   ```

2. **GREEN Phase**: Implement fix
   ```
   fix(dashboard): implement SSE reconnection

   Fix: dashboard-sse-fix
   Task: Implement SSE reconnection

   Add exponential backoff reconnection logic...

   🤖 Generated by Tiny Brain
   ```

3. **REFACTOR Phase** (optional): Clean up
   ```
   refactor(dashboard): extract reconnection strategy

   Fix: dashboard-sse-fix
   Task: Implement SSE reconnection

   Extract reconnection logic to separate module...

   🤖 Generated by Tiny Brain
   ```

### Tracking

Commits with `Fix:` and `Task:` headers are the SHA signals status is derived
from:
- `test:` commits record the RED sha → the task derives `in_progress`
- `fix:` commits record the GREEN sha → the task derives `completed` once its
  review pipeline reaches its terminal phase
- `refactor:` commits record the refactor sha (closing a needs-refactoring gate)

**Note:** status is **git-derived** — it is a pure function of the commits
above, not of the markdown. The operational `progress.json` cache under
`.git/tiny-brain/` is projected from git on read; you do **not** hand-edit the
task `status:` in `docs/fixes/{fix-id}.md` to track progress (nothing reads it).
The markdown remains the source of truth for the fix's *identity and intent*
(id, title, tasks, resolution), not its live status.

### Task Status Values

These are the lifecycle states git derives for a task (and for the fix that
aggregates them) — the vocabulary you'll see in the dashboard and `tiny-brain work`:

| Status | Meaning | Git signal |
|--------|---------|------------|
| `not_started` | No commit yet | no `test:`/`fix:` commit for the task |
| `in_progress` | Work underway | a `test:` (RED) commit, or a review owed a refactor |
| `completed` | Done | the pinned review pipeline reached its terminal phase |
| `superseded` | No longer needed | a `supersede:` terminal commit |

**Important:**
- A task `completed`s through its TDD commits + review pipeline, not a manual edit.
- `superseded` is recorded with a `supersede:` commit (`tiny-brain work task supersede`),
  for work resolved elsewhere or no longer relevant.

## Completing a Fix

When all tasks are done (via their TDD commits + review pipeline, or a
`supersede:` commit), the fix's status is **already** `completed` in git — you
do not flip it. The completion ceremony records the *resolution audit trail*:
the `resolved` timestamp and the `resolution:` block.

### Step 1: Record the resolution in frontmatter

Add the `resolved` timestamp and `resolution:` block to the fix document's YAML
frontmatter. Do **not** add or change a `status:` line — status is git-derived.

```yaml
---
id: dashboard-sse-fix
uuid: 019e7af9-eb3b-7dbc-a687-29b73f579360
title: Dashboard SSE connection fails
severity: medium
reported: 2026-01-07T15:30:00.000Z
resolved: 2026-01-21T15:30:00.000Z  # Add ISO timestamp
resolution:
  rootCause: The SSE endpoint path changed in v2.0 but the client was not updated
  fix:
    - Updated SSE client to use new endpoint path
    - Added retry logic for connection failures
    - Fixed timeout handling
  filesModified:
    - packages/dashboard/src/services/SSEClient.ts
    - packages/dashboard/src/hooks/useSSE.ts
---
```

Leave `id` / `uuid` exactly as `tiny-brain work add` wrote them; you are only adding the
`resolved` timestamp and the `resolution:` block.

### Step 2: Sync Progress

Run sync-file to project the resolution into progress.json:

```bash
tiny-brain task sync docs/fixes/{fix-id}.md
```

### Resolution Fields

| Field | Description |
|-------|-------------|
| `rootCause` | Brief explanation of what caused the bug |
| `fix` | Array of actions taken to fix the issue |
| `filesModified` | Array of file paths that were changed |

## Deliverability

A fix is a single deliverable unit — one worker should carry it in one run. Apply the
canonical rubric in `docs/deliverability-rubric.md`; read that file rather than a summary
here (it is the single source of truth). A fix most often trips on scope — if it needs
several independent slices it's a PRD, not a fix — or on an undeclared new dependency /
environment requirement; check those areas against the rubric.

### Closing self-check + deliverability review

Before you finish, re-read the fix against every rule in `docs/deliverability-rubric.md`
and confirm it satisfies each.

The fix commit (Step 6) is the **authoring commit** — the post-commit hook prints the owed
`deliverability` planning gate at that sha. Respond to it: for a fix with **2+ tasks or any
declared environment requirement**, dispatch the `matching specialist reviewer` and record its
verdict at the authoring sha (single-task, no-requirement fixes may rely on the self-check
alone, leaving the gate "not assessed"):

1. **Dispatch** with the Codex agent delegation (`Codex role: matching specialist reviewer`):
   ```
   Review the deliverability of:
   - Fix: <fix-slug>
   ```
2. **Resolve the authoring sha:** `git rev-parse HEAD` (or, re-running later,
   `git log -1 --format=%H -- docs/fixes/<fix-slug>.md`).
3. **Persist the verdict**, mapping the agent's verdict to a pipeline `ReviewVerdict`
   (`deliverable` → `clean`, `needs-rework` → `needs-refactoring`, `not-reviewable` → do
   not persist) and replacing the JSON's `verdict` field with the mapped value (keep
   `summary` — persist requires it):
   ```bash
   tiny-brain _review persist deliverability --planning --sha <authoring-sha> --fix <fix-slug> --json-file <deliverability.json>
   ```
   > ⚠️ **Never persist the agent's raw verdict.** `parsePersistedReview` coerces any
   > unknown verdict to `clean`, so a raw `needs-rework` would fold as **passed**. Map first.

A fix gets **only** the deliverability review — architecture-alignment is a PRD concern (a
fix carries no `## Architecture Alignment` section), so `/plan` runs that gate, not `/fix`.
Surface the verdict to the user; the review is report-only and never edits the fix.

## Quality Checklist

- [ ] Fix passes the deliverability rubric (`docs/deliverability-rubric.md`) — see the Deliverability self-check
- [ ] Fix and tasks created via `tiny-brain work add` (no hand-written `id:` / `uuid:`)
- [ ] Root cause is clearly documented
- [ ] Reproduction steps are included
- [ ] Test plan has at least one test category
- [ ] Tasks use TDD approach (test first)
- [ ] Severity is appropriate
- [ ] On completion: `resolved` timestamp + `resolution:` block recorded (status is git-derived)

## Template

- Fix body structure: `templates/fix-template.md` (reference, not a file to copy)

## Example

```
User: "The dashboard isn't loading after the upgrade"

Assistant:
1. Investigate: Check logs, network requests, SSE endpoint
2. Identify: "The SSE endpoint path changed in v2.0"
3. Create:
   tiny-brain work add fix dashboard-sse-endpoint-changed "Dashboard SSE endpoint changed in v2.0"
   tiny-brain work add task --fix dashboard-sse-endpoint-changed "Point the SSE client at the new endpoint"
4. Flesh out root cause + test plan with Edit
5. Commit; confirm: "Created fix document with 1 task"
6. Ask: "Would you like me to implement this fix now?"

If user says yes:
7. Write failing test (test: commit with Fix:/Task: headers)
8. Implement fix (fix: commit with Fix:/Task: headers)
9. Optional refactor (refactor: commit)
```
