---
id: fix-id-here
title: Brief Description of the Fix
status: investigating
severity: medium
reported: YYYY-MM-DD
resolved: null
---

# Fix: [Title]

## Issue Summary

**Reported:** [Date]
**Severity:** [low | medium | high | critical]
**Status:** [investigating | in_progress | resolved]

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
Add test that reproduces the bug.

**Files to modify/create:**
- `path/to/test.ts`

**Expected changes:**
- Add test case that fails with current code
- Test should pass after fix

### 2. Implement fix
Fix the root cause.

**Files to modify/create:**
- `path/to/file.ts`

**Expected changes:**
- Fix the logic error
- Ensure backward compatibility

### 3. Verify regression tests
Run full test suite.

**Expected outcome:**
- All regression tests pass
- New test passes
- No unexpected failures

## Resolution

[Fill in after fix is complete]

**Fix Commit:** [SHA]
**Resolution Date:** [Date]
**Verified By:** [Name or "automated tests"]

## Lessons Learned

[Optional: What can we do to prevent similar issues?]

- Lesson 1
- Lesson 2
