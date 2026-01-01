---
id: feature-id
prd_id: parent-prd-id
title: Feature Title
status: defined
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Feature: [Feature Title]

## Description

[Provide a comprehensive description of what this feature does, why it's needed, and how it fits into the larger PRD. Be specific about the functionality it provides.]

## Acceptance Criteria

[List the specific, testable criteria that must be met for this feature to be considered complete. Use checkboxes for tracking.]

- [ ] Criterion 1: [Specific requirement]
- [ ] Criterion 2: [Specific requirement]
- [ ] Criterion 3: [Specific requirement]
- [ ] Criterion 4: [Specific requirement]

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
| path/to/test.ts | new case for feature | ❌ |

## Tasks

[List all implementation tasks. Each task should be a discrete unit of work that can be completed with a single commit (or small set of commits for TDD: test/impl/refactor). Tasks will automatically track commit SHAs when using git hooks with conventional commit messages.]

### 1. Task Name
[Brief description of what needs to be done]

**Files to modify/create:**
- `path/to/file1.ts`
- `path/to/file2.ts`

**Expected changes:**
- Change 1: [Description]
- Change 2: [Description]
- Change 3: [Description]

### 2. Task Name
[Brief description of what needs to be done]

**Files to modify/create:**
- `path/to/file1.ts`

**Expected changes:**
- Change 1: [Description]
- Change 2: [Description]

[Add more tasks as needed. Each task will track:
- testCommitSha: When you commit with "test: ..." prefix
- commitSha: When you commit with "feat: ..." prefix
- refactorCommitSha: When you commit with "refactor: ..." prefix]

## Dependencies

[List any dependencies this feature has on other features or external systems]

- **Feature/System 1**: [Description of dependency]
- **Feature/System 2**: [Description of dependency]

## Testing Strategy

[Describe how this feature will be tested]

### Unit Tests
- Test scenario 1
- Test scenario 2
- Test scenario 3

### Integration Tests
- Integration scenario 1
- Integration scenario 2

### Manual Testing
- Manual test case 1
- Manual test case 2

## Implementation Notes

[Optional: Add any technical notes, considerations, or important details for implementers]

- Note 1: [Important consideration]
- Note 2: [Technical detail]
- Note 3: [Edge case to handle]
