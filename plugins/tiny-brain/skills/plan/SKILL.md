---
name: plan
version: 1.0.0
description: Create a new PRD (Product Requirements Document). Use when user wants to plan a new feature, product, or initiative.
allowed-tools: Read, Write, Bash(mkdir:*), Bash(git config:*), Bash(git add:*), Bash(git commit:*)
---

# PRD Creation Skill

## When to Use

Create a PRD when the user describes:
- A new product feature or capability
- A system enhancement or improvement
- A major technical initiative
- Multi-step implementation requiring planning

## Workflow

### Step 1: Engage in Interactive Planning

Work iteratively with the user to understand:
- **Purpose**: What problem are we solving?
- **Goals**: What do we want to achieve?
- **User needs**: Who benefits and how?
- **Features**: What functionality is needed?
- **Constraints**: What limitations exist?

Ask clarifying questions. Don't jump straight to creating files.

### Step 2: Create PRD Directory

```bash
mkdir -p docs/prd/{prd-id}/features
```

### Step 3: Create PRD File

Use the template at `templates/prd-template.md` and save to `docs/prd/{prd-id}/prd.md`.

**YAML Frontmatter:**
```yaml
---
id: descriptive-kebab-case-id
title: "Clear, User-Focused Title"
version: 1.0.0
status: not_started
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: Claude Code
---
```

### Step 4: Create Feature Files

For each feature identified, create a file at `docs/prd/{prd-id}/features/{feature-id}.md`.

Use the template at `templates/feature-template.md`.

**Feature Numbering (Critical for Sync):**
Each feature MUST have a unique `number` field in its YAML frontmatter, starting at 1 and incrementing sequentially. This number determines task ID prefixes (`task-{number}-{n}`) and feature ordering in the dashboard.

```yaml
---
id: feature-kebab-case-id
prd_id: parent-prd-id
number: 1  # Increment for each feature: 1, 2, 3...
title: Feature Title
status: not_started
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Task Format (Critical for Sync):**
Tasks MUST use this format for automatic extraction:
```markdown
## Tasks

### 1. First task title
Description of task...

**Files to modify/create:**
- file1.ts
- file2.ts

### 2. Second task title
Description...
```

**Task Granularity Guidance:**
- Tasks should be granular enough to be independently testable
- Related tasks that are naturally implemented together CAN be grouped in a single commit
- Each task needs its own `Task:` header in the commit message for tracking
- Multiple `Task:` headers in one commit will all be tracked with the same commit SHA
- **NEVER split TDD phases into separate tasks.** A task describes WHAT to build, not HOW. "Write failing tests for X" and "Implement X" should be ONE task: "Add X". The TDD cycle (test/impl/refactor) happens within each task.
- **NEVER create verification-only tasks** like "Verify all tests pass" or "Run integration tests". These produce no commits and always end up superseded. Verification is part of the TDD cycle, not a standalone task.

Example multi-task commit:
```
feat(api): add user endpoints

PRD: user-management
Feature: user-api
Task: Create user service
Task: Add user endpoints
Task: Add validation middleware

Implements user management API...
```

### Step 5: Automatic Progress Syncing

Progress syncing happens **automatically** when you:
- **Write/Edit markdown files** - The Claude tool hook (`sync-progress.sh`) detects PRD/feature file changes and syncs them
- **Commit PRD-tracked work** - The git post-commit hook updates progress with commit SHAs

**What auto-sync does:**
- Reads `prd.md` and all `features/*.md` files
- Extracts tasks using the `### N. Task` pattern
- Generates/updates `.tiny-brain/progress/{prd-id}.json`
- Preserves existing commit SHAs and task status
- Makes the PRD visible in the dashboard

**No manual action required** - just write your markdown files and the sync happens automatically.

### Step 6: Commit PRD Files

After creating and syncing, commit the PRD files so they're tracked in git:

```bash
git add docs/prd/{prd-id}/ .tiny-brain/progress/{prd-id}.json
git commit -m "chore: add PRD {prd-id}"
```

### Step 7: Confirm Creation

Tell the user:
> "I've created PRD '{title}' with {N} features at `docs/prd/{prd-id}/`"

Offer to add more features using the `/feature` skill.

## Quality Checklist

Before finalizing:
- [ ] All YAML frontmatter fields filled
- [ ] ID is unique and in kebab-case
- [ ] Purpose clearly states the problem
- [ ] User needs include specific user stories
- [ ] Each feature has its own markdown file
- [ ] Features linked from main PRD
- [ ] Acceptance criteria are testable
- [ ] Tasks use `### N. Task Name` format

## Templates

- PRD: `templates/prd-template.md`
- Feature: `templates/feature-template.md`

## Re-syncing After Changes

If you modify markdown files using Claude's Write or Edit tools, progress.json is **automatically updated** by the sync-progress hook.

For manual re-sync (e.g., after external edits), use the CLI:

```bash
npx tiny-brain sync-file docs/prd/your-prd-id/prd.md
```

This preserves existing commit tracking while updating tasks from markdown.

## Example

```
User: "We need to add code quality analysis to tiny-brain"

Claude:
1. Ask: "What aspects of quality? Linting? Metrics? Reports?"
2. Ask: "Should it integrate with existing workflows?"
3. Once clarified, create:
   - docs/prd/code-quality-analysis/prd.md
   - docs/prd/code-quality-analysis/features/quality-service.md
   - docs/prd/code-quality-analysis/features/quality-cli.md
4. After writing the feature files, progress.json is automatically synced
5. Confirm creation - PRD now visible in dashboard
```
