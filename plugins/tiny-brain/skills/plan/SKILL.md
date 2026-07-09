---
name: plan
version: 2.0.0
description: Create a new PRD (Product Requirements Document). Use when user wants to plan a new feature, product, or initiative.
allowed-tools: Read, Edit, Task, Bash(tiny-brain:*), Bash(tb:*), Bash(git config:*), Bash(git add:*), Bash(git commit:*)
---

# PRD Creation Skill

## When to Use

Create a PRD when the user describes:
- A new product feature or capability
- A system enhancement or improvement
- A major technical initiative
- Multi-step implementation requiring planning

## Identity model: slugs and UUIDs

Every PRD, feature, and task carries a stable **UUIDv7** as its real identity.
You never type one. The `tb work add` commands generate the UUID, stamp it into
the markdown frontmatter (`uuid:`), and assign positional ordering. Humans and
commit messages refer to work by its **slug** (a kebab-case `id:`) and its task
**description** — the tooling resolves those to the UUID internally.

So: **create every PRD / feature / task through `tb work add`.** Do not hand-write
`id:`, `uuid:`, or `number:` frontmatter, and do not invent `task-N-M` ids — those
were a derivation-from-shape convention that no longer exists under UUIDs.

## Workflow

### Step 1: Engage in Interactive Planning

Work iteratively with the user to understand:
- **Purpose**: What problem are we solving?
- **Goals**: What do we want to achieve?
- **User needs**: Who benefits and how?
- **Features**: What functionality is needed?
- **Constraints**: What limitations exist?

Ask clarifying questions. Don't jump straight to creating files.

### Step 2: Create the PRD shell

```bash
tb work add prd <prd-slug> "Clear, User-Focused Title"
```

This creates `docs/prd/<prd-slug>/prd.md` (and the `features/` directory) with
frontmatter — `id`, `uuid`, `status: not_started`, dates — already filled in.

### Step 3: Create each feature

For every feature you identified, run:

```bash
tb work add feature --prd <prd-slug> <feature-slug> "Feature Title"
```

This writes `docs/prd/<prd-slug>/features/<feature-slug>.md` with frontmatter,
including the next positional `number` (assigned automatically — never set it by
hand).

### Step 4: Add each task to its feature

For every task in a feature, run:

```bash
tb work add task --feature <feature-slug> "Exact task description"
```

This appends a task block (with its own generated `uuid:`) to the feature doc.
The task **description** is the identity you'll use later in commit `Task:`
headers — write it as you want to refer to it.

`--prd <prd-slug>` is **optional** — add it only to disambiguate when the same
feature slug exists in more than one PRD (otherwise the CLI finds the feature on
its own, and errors asking for `--prd` if the slug is ambiguous).

**Task Granularity Guidance:**
- Tasks should be granular enough to be independently testable
- Related tasks that are naturally implemented together CAN be grouped in a single commit
- Each task needs its own `Task:` header in the commit message for tracking
- Multiple `Task:` headers in one commit will all be tracked with the same commit SHA
- **NEVER split TDD phases into separate tasks.** A task describes WHAT to build, not HOW. "Write failing tests for X" and "Implement X" should be ONE task: "Add X". The TDD cycle (test/impl/refactor) happens within each task.
- **NEVER create verification-only tasks** like "Verify all tests pass" or "Run integration tests". These produce no commits and always end up superseded. Verification is part of the TDD cycle, not a standalone task.

**Anti-patterns to reject if the user asks for them:**
```markdown
# ❌ Splits one cycle across two tasks — DO NOT
"Write failing tests for user authentication"
"Implement user authentication"

# ❌ Manual / verification-only — DO NOT
"User visually verifies in dev dashboard"
"Run integration test suite"
"Confirm rollout in staging"
```

Correct shape — one task per behaviour, full TDD cycle inside:
```bash
tb work add task --feature user-api "Add user authentication"
```

### Step 5: Flesh out the prose

`tb work add` writes the frontmatter plus a **minimal** body scaffold — the PRD
gets `Purpose and Goals` + `Features`; a feature gets `Description` + `Tasks`.
Use the **Edit** tool to expand from there: add the richer sections (User
Stories, Acceptance Criteria, Release Criteria, Testing Strategy, per-task notes
and "Files to modify" lists) and fill in the prose.

The templates show the full body structure to aim for — they are the source of
the sections the scaffold doesn't pre-render:
- PRD: `templates/prd-template.md`
- Feature: `templates/feature-template.md`

These are **body-structure references, not files to copy**. The CLI already owns
the frontmatter — edit the prose sections only, and leave the frontmatter
(`id` / `uuid` / `number` / dates) and the task block ids exactly as `tb work
add` wrote them.

### Step 6: Commit the PRD files

```bash
git add docs/prd/<prd-slug>/
git commit -m "chore: add PRD <prd-slug>"
```

Progress state is projected from the markdown automatically (the sync-progress
hook on write, the post-commit hook on commit) — no manual progress file edits.

### Step 7: Confirm Creation

Tell the user:
> "I've created PRD '{title}' with {N} features at `docs/prd/<prd-slug>/`"

Offer to add more features using the `/feature` skill.

### Step 8: Run the deliverability review (enforcement)

After the PRD is created and committed, **always** dispatch the `deliverability-reviewer`
agent to check the breakdown against the rubric — this is the enforcement pass for the
Deliverability section below, and it runs every time, not only when you remember.

Use the Task tool with `subagent_type: deliverability-reviewer` and a prompt naming the
PRD:

```
Review the deliverability of:
- PRD: <prd-slug>
```

Surface the result to the user: report the `verdict` (`deliverable` / `needs-rework` /
`not-reviewable`) and, when it is `needs-rework`, the findings and per-feature scorecard so
the author can reshape features before any worker is dispatched. The agent is report-only —
it never edits the PRD; you and the user decide what to change.

## Commit headers (for the implementation work later)

When work on a task is committed, the commit carries:

```
feat(api): add user endpoints

PRD: user-management
Feature: user-api
Task: Add user service
Task: Add user endpoints

Implements user management API...
```

The `Task:` value is the **task description as it appears in the markdown** — the
commit-msg hook resolves it to the task's UUID at hook time. Multiple `Task:`
headers in one commit are all tracked against that SHA. Use the **exact** task
description — the hook matches by equality (it only trims whitespace and
tolerates escaped backticks), so a reworded header fails to resolve.

## Deliverability

A PRD is only as good as its workers can deliver. As you break the initiative into
features and tasks, shape each so a **single worker can carry it in one run**, and apply
the canonical rubric in `docs/deliverability-rubric.md`. Read that file — it is the single
source of truth for what "deliverable" means, so this skill points at it rather than
restating its rules (a copy here would drift).

### Closing self-check

Before you finalize the PRD, re-read your feature breakdown against every rule in
`docs/deliverability-rubric.md` and confirm each feature satisfies it. The
`deliverability-reviewer` agent enforces the same rubric at design altitude — authoring to
it up front means fewer round-trips.

## Quality Checklist

Before finalizing:
- [ ] Feature breakdown passes the deliverability rubric (`docs/deliverability-rubric.md`) — see the Deliverability self-check above
- [ ] PRD, features, and tasks all created via `tb work add` (no hand-written `id:` / `uuid:`)
- [ ] Slug is unique and in kebab-case
- [ ] Purpose clearly states the problem
- [ ] User needs include specific user stories
- [ ] Each feature has its own markdown file
- [ ] Acceptance criteria are testable
- [ ] No TDD-split or verification-only tasks

## Re-syncing After Changes

Progress state is projected from the markdown automatically when you write or
commit. For a manual re-sync after external edits:

```bash
tiny-brain task sync docs/prd/<prd-slug>/prd.md
```

This preserves existing commit tracking while updating tasks from markdown.

## Example

```
User: "We need to add code quality analysis to tiny-brain"

Claude:
1. Ask: "What aspects of quality? Linting? Metrics? Reports?"
2. Ask: "Should it integrate with existing workflows?"
3. Once clarified, create the structure:
   tb work add prd code-quality-analysis "Code Quality Analysis"
   tb work add feature --prd code-quality-analysis quality-service "Quality Service"
   tb work add feature --prd code-quality-analysis quality-cli "Quality CLI"
   tb work add task --feature quality-service "Add metric collector"
4. Fill in Description / Acceptance Criteria with Edit
5. Commit; the PRD is now visible in the dashboard
```
