---
name: feature
version: 1.0.0
description: Add a feature to an existing PRD. Use when user wants to add functionality to an existing product plan.
allowed-tools: Read, Write, Bash(mkdir:*), Bash(git config:*)
---

# Feature Creation Skill

## When to Use

Add a feature when the user wants to:
- Add new functionality to an existing PRD
- Break down a large capability into trackable tasks
- Document implementation details for a specific feature

## Workflow

### Step 1: Identify Target PRD

Ask the user which PRD to add the feature to, or detect from context.

List existing PRDs:
```bash
ls docs/prd/
```

### Step 2: Understand the Feature

Work with the user to define:
- **What**: What does this feature do?
- **Why**: Why is it needed?
- **Acceptance criteria**: How do we know it's done?
- **Tasks**: What implementation steps are required?

### Step 3: Create Feature File

Use the template at `templates/feature-template.md`.

Save to: `docs/prd/{prd-id}/features/{feature-id}.md`

**YAML Frontmatter:**
```yaml
---
id: feature-kebab-case-id
prd_id: parent-prd-id
title: Feature Title
status: defined
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### Step 4: Define Tasks

**Critical:** Use this exact format for task extraction:

```markdown
## Tasks

### 1. First task title
Description of what needs to be done.

**Files to modify/create:**
- `path/to/file1.ts`
- `path/to/file2.ts`

**Expected changes:**
- Change 1
- Change 2

### 2. Second task title
Description...

**Files to modify/create:**
- `path/to/file.ts`
```

Each `### N. Title` becomes a trackable task with:
- Test commit tracking (`test:` prefix)
- Implementation commit tracking (`feat:` prefix)
- Refactor commit tracking (`refactor:` prefix)

**Task Granularity Guidance:**
- Tasks should be granular enough to be independently testable
- Related tasks that are naturally implemented together CAN be grouped in a single commit
- Each task needs its own `Task:` header in the commit message for tracking
- Multiple `Task:` headers in one commit will all be tracked with the same commit SHA

Example multi-task commit:
```
feat(dashboard): add hooks display components

PRD: dashboard-hooks-display
Feature: hooks-display-ui
Task: Add hooks state to RepoDetailPage
Task: Add Hooks tab to repo header
Task: Create HooksList component

Implements hooks list and selection...
```

### Step 5: Identify and Document Test Plan

**IMPORTANT:** Before implementation, analyze the codebase to identify relevant tests.

#### 5a: Identify Relevant Tests

1. **Find existing tests for affected code:**
   - Look for test files adjacent to source files being modified
   - Check `__tests__/` directories
   - Search for tests that import affected modules

2. **Read the test files** to understand:
   - Which test cases exercise the code paths you'll modify
   - Which assertions may need to change
   - What new scenarios need test coverage

3. **Categorize each test:**
   - **Regression**: Tests that should continue to pass unchanged
   - **Amended**: Tests whose expectations need updating
   - **New**: Tests that need to be written

#### 5b: Document in Feature File

Add a Test Plan section using emoji categories:

| Emoji | Category | Description |
|-------|----------|-------------|
| `🔒` | Regression | Must pass unchanged |
| `✏️` | Amended Case | Existing case to be modified |
| `🆕` | New Case | New test case in existing file |
| `📄` | New File | Entirely new test file |

```markdown
## Test Plan

### 🔒 Regression Tests
| File | Cases | Status |
|------|-------|--------|
| src/__tests__/existing.test.ts | all existing | ❌ |

### 🆕 New Tests
| File | Case | Status |
|------|------|--------|
| src/__tests__/feature.test.ts | handles new feature | ❌ |
```

### Step 6: Update Parent PRD

Add a reference to the new feature in `docs/prd/{prd-id}/prd.md`:

```markdown
### Feature N: {Feature Title}
**File**: [features/{feature-id}.md](features/{feature-id}.md)
**Status**: defined
**Description**: Brief description of what this feature does
```

### Step 7: Sync Progress

After creating the feature file, call:
```
plan sync
```

This updates `progress.json` with the new feature and tasks.

### Step 8: Confirm Creation

Tell the user:
> "I've added feature '{title}' to PRD '{prd-id}' with {N} tasks."

## Quality Checklist

- [ ] Feature ID is unique within the PRD
- [ ] prd_id matches parent PRD exactly
- [ ] Acceptance criteria are testable (use checkboxes)
- [ ] Tasks use `### N. Task Name` format (numbered)
- [ ] Each task has files to modify listed
- [ ] Test plan identifies regression/amended/new tests
- [ ] Feature is linked from parent PRD

## Template

- Feature: `templates/feature-template.md`

## Example

```
User: "Add a quality CLI command to the code-quality PRD"

Claude:
1. Confirm PRD: "Adding to code-quality-analysis PRD?"
2. Discuss: "What subcommands? What options?"
3. Create:
   - docs/prd/code-quality-analysis/features/quality-cli-command.md
4. Update:
   - docs/prd/code-quality-analysis/prd.md (add feature reference)
5. Call `plan sync`
6. Confirm: "Added 'Quality CLI Command' with 5 tasks"
```
