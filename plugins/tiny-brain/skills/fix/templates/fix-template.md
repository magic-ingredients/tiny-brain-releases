---
id: fix-id-here
title: Brief Description of the Fix
status: not_started
severity: medium
reported: YYYY-MM-DDTHH:MM:SS.sssZ
resolved: null
# When completed, add:
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
**Status:** [not_started | in_progress | completed | superseded]

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
  Each task is ONE complete TDD cycle: failing test + implementation +
  any refactors triggered by review, all under the same task.

  - DO NOT split into "Write test for X" + "Implement X" — that's half a
    cycle each.
  - DO NOT add manual / verification-only tasks (e.g. "User checks the
    dashboard", "Run tests"). They produce no commit and always end up
    superseded.
  - DO bundle tests with the behaviour they cover.
-->

### 1. Reproduce and fix [behaviour]
status: not_started

End-to-end task — failing test, implementation, and any review-driven
refactors land under this one task.

**Files to modify/create:**
- `path/to/__tests__/file.test.ts`
- `path/to/file.ts`

**Expected changes:**
- Add failing test that reproduces the bug
- Implement the fix so the test passes
- All existing tests still pass

## Resolution

When all tasks are complete, update the YAML frontmatter:
1. Set `status: completed`
2. Set `resolved:` to ISO timestamp (e.g., `2026-01-21T15:30:00.000Z`)
3. Add `resolution:` object with `rootCause`, `fix` (array), and `filesModified` (array)
4. Run `npx tiny-brain sync-file .tiny-brain/fixes/{fix-id}.md`

## Lessons Learned

[Optional: What can we do to prevent similar issues?]

- Lesson 1
- Lesson 2
