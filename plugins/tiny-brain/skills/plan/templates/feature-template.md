---
id: feature-id
prd_id: parent-prd-id
number: 1
title: Feature Title
status: not_started
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

## Tasks

[List all implementation tasks. Each task should be a discrete unit of work that can be completed with a single commit (or small set of commits for TDD: test/impl/refactor). Tasks will automatically track commit SHAs when using git hooks with conventional commit messages.

IMPORTANT - Do NOT split TDD phases into separate tasks. TDD is the workflow for completing each task, not the task itself. Each task describes WHAT to build; the red/green/refactor cycle is HOW you build it.

BAD (never do this):
- "Write failing tests for calculateScore"
- "Implement calculateScore"

GOOD:
- "Add calculateScore function with grade thresholds"

Also never create verification-only tasks like "Verify all tests pass" or "Run integration tests". These produce no commits and always end up superseded. Verification is part of the TDD cycle, not a standalone task.]

### 1. Task Name
status: not_started

[Brief description of what needs to be done]

**Files to modify/create:**
- `path/to/file1.ts`
- `path/to/file2.ts`

**Expected changes:**
- Change 1: [Description]
- Change 2: [Description]
- Change 3: [Description]

### 2. Task Name
status: not_started

[Brief description of what needs to be done]

**Files to modify/create:**
- `path/to/file1.ts`

**Expected changes:**
- Change 1: [Description]
- Change 2: [Description]

[Add more tasks as needed. Each task will track:
- status: not_started | in_progress | completed | superseded
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

## Workflow Example

[Optional: If this feature involves a specific workflow or process, document it here]

```bash
# Example command or workflow
step 1
step 2
step 3
```

## Benefits

[Optional: Highlight the key benefits this feature provides]

- Benefit 1
- Benefit 2
- Benefit 3
