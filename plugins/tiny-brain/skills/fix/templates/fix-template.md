---
id: fix-id-here
title: Brief Description of the Fix
status: documented
severity: medium
reported: YYYY-MM-DDTHH:MM:SS.sssZ
resolved: null
# When resolved, add:
# resolution:
#   rootCause: Brief description of what caused the issue
#   fix:
#     - First fix action taken
#     - Second fix action taken
#   filesModified:
#     - path/to/file1.ts
#     - path/to/file2.ts
---

# Fix: [Title]

## Issue Summary

**Reported:** [Date]
**Severity:** [low | medium | high | critical]
**Status:** [documented | in_progress | resolved]

### Reproduction Steps
1. Step to reproduce
2. Step to reproduce
3. Observe the bug

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

## Root Cause Analysis

[Explain why this bug occurs. Be specific about the code path and logic error.]

### Affected Files
- `path/to/affected/file.ts`
- `path/to/another/file.ts`

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

### 1. Write failing test
status: not_started

Add test that reproduces the bug.

**Files to modify/create:**
- `path/to/test.ts`

**Expected changes:**
- Add test case that fails with current code
- Test should pass after fix

### 2. Implement fix
status: not_started

Fix the root cause.

**Files to modify/create:**
- `path/to/file.ts`

**Expected changes:**
- Fix the logic error
- Ensure backward compatibility

### 3. Verify regression tests
status: not_started

Run full test suite.

**Expected outcome:**
- All regression tests pass
- New test passes
- No unexpected failures

## Resolution

When all tasks are complete, update the YAML frontmatter:
1. Set `status: resolved`
2. Set `resolved:` to ISO timestamp (e.g., `2026-01-21T15:30:00.000Z`)
3. Add `resolution:` object with `rootCause`, `fix` (array), and `filesModified` (array)
4. Run `npx tiny-brain sync-file .tiny-brain/fixes/{fix-id}.md`

## Lessons Learned

[Optional: What can we do to prevent similar issues?]

- Lesson 1
- Lesson 2
