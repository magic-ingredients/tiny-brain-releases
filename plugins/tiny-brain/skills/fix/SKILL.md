---
name: fix
version: 1.0.0
description: Create a fix document for bug tracking. Use when user reports a bug or wants to track a fix with full test plan.
allowed-tools: Read, Write, Bash(mkdir:*), Bash(git config:*)
---

# Fix Creation Skill

## When to Use

Create a fix document when:
- User reports a bug to investigate
- You identify an issue that needs tracking
- A fix requires multiple steps and test validation
- You want to document root cause analysis

## Workflow

### Step 1: Investigate the Issue

Before documenting, investigate:
- **Reproduction steps**: How to trigger the bug?
- **Expected behavior**: What should happen?
- **Actual behavior**: What actually happens?
- **Root cause**: Why is this happening?

Use exploration tools (grep, read, etc.) to understand the issue.

### Step 2: Create Fix Directory (if needed)

```bash
mkdir -p .tiny-brain/fixes
```

### Step 3: Create Fix Document

Use the template at `templates/fix-template.md`.

Save to: `.tiny-brain/fixes/{fix-id}.md`

**File naming:** Use descriptive kebab-case:
- `dashboard-not-loading-after-upgrade.md`
- `progress-json-sync-failing.md`
- `missing-test-coverage.md`

**YAML Frontmatter:**
```yaml
---
id: fix-kebab-case-id
title: Brief Description of the Fix
status: investigating | in_progress | resolved
severity: low | medium | high | critical
reported: YYYY-MM-DD
resolved: null
---
```

### Step 4: Document Root Cause

In the fix document, clearly explain:
1. What the bug is
2. What causes it (root cause)
3. What the fix approach is
4. What tests will validate the fix

### Step 5: Identify and Document Test Plan

**IMPORTANT:** Before documenting the test plan, you must actively analyze the codebase to identify relevant tests. Do NOT guess - read the actual test files.

#### 5a: Identify Relevant Tests

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

#### 5b: Document the Test Plan

Use the emoji schema for test categorization:

| Emoji | Category | Description |
|-------|----------|-------------|
| `🔒` | Regression | Must pass unchanged |
| `✏️` | Amended Case | Existing case to be modified |
| `📝` | Amended File | File with modified expectations |
| `🆕` | New Case | New test case in existing file |
| `📄` | New File | Entirely new test file |

**Example test plan:**
```markdown
## Test Plan

### 🔒 Regression Tests (must pass unchanged)
| File | Cases | Status |
|------|-------|--------|
| src/__tests__/service.test.ts | all existing | ❌ |

### ✏️ Amended Tests
| File | Case | Change | Status |
|------|------|--------|--------|
| src/__tests__/service.test.ts | handles errors | Update expected error | ❌ |

### 🆕 New Tests
| File | Case | Status |
|------|------|--------|
| src/__tests__/service.test.ts | handles edge case | ❌ |
```

### Step 6: Define Tasks

Use the same task format as features:

```markdown
## Tasks

### 1. Write failing test for the fix
Add test that reproduces the bug.

**Files to modify:**
- `src/__tests__/service.test.ts`

### 2. Implement the fix
Fix the root cause.

**Files to modify:**
- `src/service.ts`
```

### Step 7: Sync Progress

After creating the fix document, call:
```
plan sync
```

### Step 8: Confirm and Offer Implementation

Tell the user:
> "I've created fix document '{title}' at `.tiny-brain/fixes/{fix-id}.md` with {N} tasks."

Then **always ask**:
> "Would you like me to implement this fix now?"

If yes, proceed to implement using the TDD workflow below.

## Implementation Workflow

When implementing a fix, follow TDD phases with proper commit tracking.

### Commit Format for Fixes

```
fix(scope): commit title

Fix: {fix-id}
Task: {exact-task-description}

Description of changes...

🤖 Generated with Claude Code
```

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
   Task: Write failing test for reconnection

   Add test that verifies the SSE client reconnects...

   🤖 Generated with Claude Code
   ```

2. **GREEN Phase**: Implement fix
   ```
   fix(dashboard): implement SSE reconnection

   Fix: dashboard-sse-fix
   Task: Implement SSE reconnection

   Add exponential backoff reconnection logic...

   🤖 Generated with Claude Code
   ```

3. **REFACTOR Phase** (optional): Clean up
   ```
   refactor(dashboard): extract reconnection strategy

   Fix: dashboard-sse-fix
   Task: Implement SSE reconnection

   Extract reconnection logic to separate module...

   🤖 Generated with Claude Code
   ```

### Tracking

Commits with `Fix:` and `Task:` headers are automatically tracked in `.tiny-brain/fixes/progress.json`:
- `test:` commits update `testCommitSha` and set status to `tested`
- `fix:` commits update `commitSha` and set status to `completed`
- `refactor:` commits update `refactorCommitSha`

### Task Status Values

When updating `.tiny-brain/fixes/progress.json` manually, use these statuses:

| Status | When to Use | Requirements |
|--------|-------------|--------------|
| `defined` | Task created but not started | None |
| `tested` | Tests written (RED phase) | `testCommitSha` required |
| `completed` | Implementation done (GREEN phase) | `commitSha` required |
| `superseded` | Task no longer needed (work done elsewhere or obsolete) | No commit required |

**Important:**
- `completed` MUST have a `commitSha` - this is how we verify work was done
- `superseded` is for tasks that were resolved by other work (e.g., a refactoring that fixed multiple issues) or are no longer relevant
- When marking a fix as `resolved`, all tasks should be either `completed` (with commit) or `superseded`

## Quality Checklist

- [ ] Root cause is clearly documented
- [ ] Reproduction steps are included
- [ ] Test plan has at least one test category
- [ ] Tasks use TDD approach (test first)
- [ ] Severity is appropriate
- [ ] Status reflects current state

## Template

- Fix: `templates/fix-template.md`

## Example

```
User: "The dashboard isn't loading after the upgrade"

Claude:
1. Investigate: Check logs, network requests, SSE endpoint
2. Identify: "The SSE endpoint path changed in v2.0"
3. Create:
   - .tiny-brain/fixes/dashboard-sse-endpoint-changed.md
   - Document root cause, test plan, fix tasks
4. Call `plan sync`
5. Confirm: "Created fix document with 3 tasks"
6. Ask: "Would you like me to implement this fix now?"

If user says yes:
7. Write failing test (test: commit with Fix:/Task: headers)
8. Implement fix (fix: commit with Fix:/Task: headers)
9. Verify all tests pass
10. Optional refactor (refactor: commit)
```
