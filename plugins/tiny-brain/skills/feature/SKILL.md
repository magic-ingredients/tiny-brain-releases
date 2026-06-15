---
name: feature
version: 2.0.0
description: Add a feature to an existing PRD. Use when user wants to add functionality to an existing product plan.
allowed-tools: Read, Edit, Bash(tiny-brain:*), Bash(tb:*), Bash(git add:*), Bash(git commit:*)
---

# Feature Creation Skill

## When to Use

Add a feature when the user wants to:
- Add new functionality to an existing PRD
- Break down a large capability into trackable tasks
- Document implementation details for a specific feature

## Identity model: slugs and UUIDs

Every feature and task carries a stable **UUIDv7** as its real identity, which
`tb work add` generates and stamps into the markdown — you never type one. The
feature's positional `number:` is assigned by the CLI from the existing siblings;
you never set it. Humans and commit messages refer to work by its **slug** and
its task **description**, which the tooling resolves to the UUID internally.

So: **create the feature and every task through `tb work add`.** Do not
hand-write `id:` / `uuid:` / `number:` frontmatter, and do not invent
`task-N-M` ids — that was a derivation-from-shape convention that no longer
exists under UUIDs.

## Workflow

### Step 1: Identify Target PRD

Ask the user which PRD to add the feature to, or detect from context. List
existing PRDs:

```bash
tb work --kind prd
```

### Step 2: Understand the Feature

Work with the user to define:
- **What**: What does this feature do?
- **Why**: Why is it needed?
- **Acceptance criteria**: How do we know it's done?
- **Tasks**: What implementation steps are required?

### Step 3: Create the feature

```bash
tb work add feature --prd <prd-slug> <feature-slug> "Feature Title"
```

This writes `docs/prd/<prd-slug>/features/<feature-slug>.md` with the frontmatter
filled in — `id`, `uuid`, `prd_id`, the next positional `number`, `status`,
dates. The CLI owns all of it.

### Step 4: Add each task

For every implementation task, run:

```bash
tb work add task --feature <feature-slug> "Exact task description"
```

`--prd <prd-slug>` is **optional** — add it only to disambiguate when the same
feature slug exists in more than one PRD (otherwise the CLI finds the feature on
its own, and errors asking for `--prd` if the slug is ambiguous).

The task **description** is the identity used later in commit `Task:` headers —
write it as you want to refer to it. Each task block gets its own generated
`uuid:`.

**Task Granularity Guidance:**
- Tasks should be granular enough to be independently testable
- Related tasks that are naturally implemented together CAN be grouped in a single commit
- Each task needs its own `Task:` header in the commit message for tracking
- Multiple `Task:` headers in one commit will all be tracked with the same commit SHA
- **NEVER split TDD phases into separate tasks.** A task describes WHAT to build, not HOW. "Write failing tests for X" and "Implement X" should be ONE task: "Add X". The TDD cycle (test/impl/refactor) happens within each task.
- **NEVER create verification-only tasks** like "Verify all tests pass" or "Run integration tests". These produce no commits and always end up superseded. Verification is part of the TDD cycle, not a standalone task.

**Anti-patterns to reject if the user asks for them:**
```
# ❌ Splits one cycle across two tasks — DO NOT
"Write failing tests for hooks display"
"Implement hooks display"

# ❌ Manual / verification-only — DO NOT
"User visually verifies in dev dashboard"
"Run integration test suite"
```

Correct shape — one task per behaviour, full TDD cycle inside:
```bash
tb work add task --feature hooks-display-ui "Add hooks display component"
```

### Step 5: Flesh out the prose and test plan

`tb work add` writes the frontmatter plus a minimal body scaffold (`Description`
+ `Tasks`). Use the **Edit** tool to expand the prose — Description, Acceptance
Criteria, per-task notes and "Files to modify" lists. The template
`templates/feature-template.md` is a **body-structure reference** (not a file to
copy) showing the fuller shape to aim for; the CLI owns the frontmatter, so edit
prose only and leave the frontmatter / task ids as written.

Document a Test Plan section using emoji categories:

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

Identify relevant tests first: look for test files adjacent to the source you'll
modify, check `__tests__/` directories, and categorise each as regression /
amended / new.

### Step 6: Link it from the parent PRD (optional)

If the PRD's body keeps a hand-curated Features list, add a reference to the new
feature with the **Edit** tool:

```markdown
### {Feature Title}
**File**: [features/<feature-slug>.md](features/<feature-slug>.md)
**Description**: Brief description of what this feature does
```

### Step 7: Commit

```bash
git add docs/prd/<prd-slug>/
git commit -m "chore: add feature <feature-slug> to <prd-slug>"
```

Progress state is projected from the markdown automatically (the sync-progress
hook on write, the post-commit hook on commit). For a manual re-sync after
external edits: `tiny-brain task sync docs/prd/<prd-slug>/features/<feature-slug>.md`.

### Step 8: Confirm Creation

Tell the user:
> "I've added feature '{title}' to PRD '<prd-slug>' with {N} tasks."

## Commit headers (for the implementation work later)

A commit that implements task work carries the task description in its header:

```
feat(dashboard): add hooks display components

PRD: dashboard-hooks-display
Feature: hooks-display-ui
Task: Add hooks state to RepoDetailPage
Task: Create HooksList component

Implements hooks list and selection...
```

The `Task:` value is the **task description as it appears in the markdown** — the
commit-msg hook resolves it to the task's UUID at hook time. Multiple `Task:`
headers in one commit are all tracked against that SHA. Use the **exact** task
description — the hook matches by equality (it only trims whitespace and
tolerates escaped backticks), so a reworded header fails to resolve.

## Quality Checklist

- [ ] Feature and tasks created via `tb work add` (no hand-written `id:` / `uuid:` / `number:`)
- [ ] Feature slug is unique within the PRD
- [ ] Acceptance criteria are testable (use checkboxes)
- [ ] Each task has files to modify listed
- [ ] Test plan identifies regression/amended/new tests
- [ ] No TDD-split or verification-only tasks

## Template

- Feature body structure: `templates/feature-template.md` (reference, not a file to copy)

## Example

```
User: "Add a quality CLI command to the code-quality PRD"

Claude:
1. Confirm PRD: "Adding to code-quality-analysis PRD?"
2. Discuss: "What subcommands? What options?"
3. Create:
   tb work add feature --prd code-quality-analysis quality-cli-command "Quality CLI Command"
   tb work add task --feature quality-cli-command "Add the report subcommand"
4. Flesh out Description / Acceptance Criteria / Test Plan with Edit
5. Commit; the feature is now visible in the dashboard
```
