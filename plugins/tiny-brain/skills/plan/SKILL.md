---
name: plan
version: 1.0.0
description: Create a new PRD (Product Requirements Document). Use when user wants to plan a new feature, product, or initiative.
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

### Step 5: Sync Progress

After creating all markdown files, sync to generate `progress.json`:

**Using MCP tool:**
```typescript
mcp__tiny-brain__plan({
  operation: "sync",
  planId: "your-prd-id"  // The id from your PRD frontmatter
})
```

**What sync does:**
- Reads `prd.md` and all `features/*.md` files
- Extracts tasks using the `### N. Task` pattern
- Generates/updates `.tiny-brain/progress/{prd-id}.json`
- Preserves existing commit SHAs and task status
- Makes the PRD visible in the dashboard

**Note:** The `planId` parameter matches the `id` field in your PRD's YAML frontmatter.

### Step 6: Confirm Creation

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

If you modify markdown files after initial creation, re-sync to update progress:

```typescript
mcp__tiny-brain__plan({
  operation: "sync",
  planId: "your-prd-id"
})
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
4. Call sync with planId:
   mcp__tiny-brain__plan({ operation: "sync", planId: "code-quality-analysis" })
5. Confirm creation - PRD now visible in dashboard
```
