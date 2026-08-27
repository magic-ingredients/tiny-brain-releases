---
name: plan
version: 2.0.0
description: Create a new PRD (Product Requirements Document). Use when user wants to plan a new feature, product, or initiative.
allowed-tools: Read, Edit, Task, Bash(tiny-brain:*), Bash(tb:*), Bash(git config:*), Bash(git add:*), Bash(git commit:*), Bash(git rev-parse:*), Bash(git log:*)
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
You never type one. The `tiny-brain work add` commands generate the UUID, stamp it into
the markdown frontmatter (`uuid:`), and assign positional ordering. Humans and
commit messages refer to work by its **slug** (a kebab-case `id:`) and its task
**description** — the tooling resolves those to the UUID internally.

So: **create every PRD / feature / task through `tiny-brain work add`.** Do not hand-write
`id:`, `uuid:`, or `number:` frontmatter, and do not invent `task-N-M` ids — those
were a derivation-from-shape convention that no longer exists under UUIDs.

## Workflow

### Step 1: Read ARCHITECTURE.md, then engage in interactive planning

**Before decomposing anything, read `ARCHITECTURE.md` at the repo root.**
Its principles are **inputs to the design**, not a compliance check bolted on
afterwards — so read them from the live doc rather than from any list restated
here (this skill deliberately does not enumerate them; a copy would drift).
Hold them in mind as you shape features and tasks — where does behaviour belong
in core vs. an adapter, what does the port boundary rule out — so the
decomposition is architecture-shaped from the start. You record the residue of that reasoning in the `## Architecture
Alignment` section (see Step 5), filling it *as you make each decomposition
decision* — not as a retrospective conformance pass once the design is frozen.

Do **not** copy the principle list into the skill or the PRD from memory — read
the live doc each time; it is the single source of truth and it drifts if
duplicated.

Then work iteratively with the user to understand:
- **Purpose**: What problem are we solving?
- **Goals**: What do we want to achieve?
- **User needs**: Who benefits and how?
- **Features**: What functionality is needed?
- **Constraints**: What limitations exist?

Ask clarifying questions. Don't jump straight to creating files.

**Authoring without a human in the loop** (a worker or headless run): questions
dead-end, so derive the answers from the codebase and the stated goal instead —
and record every judgement call in an explicit **Assumptions** list in the PRD
that a human can veto later. An unstated assumption is how a spec silently
drifts from intent; a stated one is a decision the user can reverse in one line.

**Ground the spec in the code, not in analogy.** Every claim about how the
system behaves *today* — the behaviour a feature extends or replaces — cites
`path:line`, verified by reading the file, and names the real symbols involved.
A PRD written from a plausible analogy ("mirror how X does it") without opening
X is how specs describe systems that don't exist. The spec's job is **context
transfer to a bounded worker**: discovery is cheap for the author and expensive
for the worker — pin files, symbols, and seams now so no worker re-derives them.
State each feature's **non-goals** too — a bounded worker needs the edge of
scope written down, or one run swallows its neighbour's work.

### Step 2: Create the PRD shell

```bash
tiny-brain work add prd <prd-slug> "Clear, User-Focused Title"
```

This creates `docs/prd/<prd-slug>/prd.md` (and the `features/` directory) with
frontmatter — `id`, `uuid`, `status: not_started`, dates — already filled in.

### Step 3: Create each feature

For every feature you identified, run:

```bash
tiny-brain work add feature --prd <prd-slug> <feature-slug> "Feature Title"
```

This writes `docs/prd/<prd-slug>/features/<feature-slug>.md` with frontmatter,
including the next positional `number` (assigned automatically — never set it by
hand).

### Step 4: Add each task to its feature

For every task in a feature, run:

```bash
tiny-brain work add task --feature <feature-slug> "Exact task description"
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
tiny-brain work add task --feature user-api "Add user authentication"
```

**Description hygiene (the description IS the commit match key):** plain prose
only — no backticks, backslashes, or quotes (the commit-msg hook matches by
string equality; escapes and shell-mangled characters make future `Task:`
headers fail to resolve). Treat a description as **frozen once its first commit
lands** — later commits are matched against the markdown text, so a mid-work
reword desyncs everything after the edit. Rename by superseding + re-adding.

### Step 5: Flesh out the prose

`tiny-brain work add` writes the frontmatter plus a **minimal** body scaffold — the PRD
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
(`id` / `uuid` / `number` / dates) and the task block ids exactly as `tiny-brain work
add` wrote them.

#### Fill the `## Architecture Alignment` section

`tiny-brain work add prd` renders an empty `## Architecture Alignment` section
into the scaffold. Fill it here — but write it as the **residue of the
decomposition you already did** in Steps 3–4 with `ARCHITECTURE.md` open, not as
a fresh conformance review invented now.

Re-open `ARCHITECTURE.md` and add **one table row per principle that actually
bore on this design.** Each row records the *design consequence* — what the
principle **pushed into the pure-function core**, what alternative it **ruled
out**, what shape it **forced** on the adapters/ports. A named rejected
alternative is the evidence that the principle was a load-bearing input; bare
conformance is not.

End the section with the mandatory `**Deviations:**` line: `none`, or one link
per deviation to the ADR that records it — mirroring `ARCHITECTURE.md`'s closing
rule that a real deviation is recorded in an ADR. If you need to deviate and
there is no ADR yet, create one with the `/adr` skill and link it.

**Reject these anti-patterns — they mean the check did not run:**
- A bare "✓ conforms" / "✓" row with no consequence.
- The `ARCHITECTURE.md` principle list copied in verbatim (it duplicates the
  source and drifts — rows come from *reading* the live doc, not restating it).
- Post-hoc conformance prose that names no design consequence. If no principle
  ruled anything out, either the PRD is trivial or the alignment check never
  actually happened — treat that as a red flag, not a pass.

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

### Step 8: Run the planning reviews and persist their verdicts (enforcement)

The PRD commit in Step 6 is the **authoring commit**. The post-commit hook detects it and
prints the owed planning gates (`deliverability`, `architecture-alignment`) at that sha.
Respond to that dispatch here — run **both** reviews and record each verdict at the
authoring sha, every time (not only when you remember).

**1. Resolve the authoring sha** — the commit that authored the PRD (Step 6's commit):

```bash
git rev-parse HEAD
```

(Re-running later, resolve it from the doc paths instead: `git log -1 --format=%H -- docs/prd/<prd-slug>/`.)

**2. Dispatch both reviewers** with the Task tool (report-only — neither edits the PRD):

- `subagent_type: deliverability-reviewer`:
  ```
  Review the deliverability of:
  - PRD: <prd-slug>
  ```
- `subagent_type: architecture-reviewer` (the PRD template always carries a
  `## Architecture Alignment` section, so this always applies to a PRD):
  ```
  Review the architecture alignment of:
  - PRD: <prd-slug>
  ```

**3. Persist each verdict** in the decided store at the authoring sha. The agents return
their own verdict vocabulary; map it to a pipeline `ReviewVerdict` before persisting:

| agent verdict (deliverability / architecture) | persist verdict |
|---|---|
| `deliverable` / `aligned` | `clean` |
| `needs-rework` | `needs-refactoring` |
| `not-reviewable` | **do not persist** — leave the gate outstanding (folds as "not assessed") |

Build the persist payload from the agent's returned JSON with its `verdict` field
**replaced by the mapped value** (keep `summary` — persist requires it — and the findings).

> ⚠️ **Never persist the agent's raw verdict.** `deliverable` / `aligned` / `needs-rework`
> are not valid `ReviewVerdict`s, and `parsePersistedReview` silently coerces any unknown
> verdict to `clean` — so a `needs-rework` review would fold as **passed**. Map first.

```bash
# --sha is the authoring sha from step 1; --json-file avoids shell-escaping the payload
tiny-brain _review persist deliverability --planning --sha <authoring-sha> --prd <prd-slug> --json-file <deliverability.json>
tiny-brain _review persist architecture-alignment --planning --sha <authoring-sha> --prd <prd-slug> --json-file <architecture.json>
```

(`--json '<json>'` also works for small payloads.)

**4. Surface both verdicts to the user** — the `verdict` and, for a rework, the findings and
per-feature scorecard, so the author can reshape before any worker is dispatched. You and
the user decide what to change; the persisted verdicts drive the plan card's
planning-checks row.

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
commit-msg hook resolves it to the task's UUID and stamps a `Task-Uuid:` trailer
onto the commit; that trailer is the **durable join** status is derived from.
Multiple `Task:` headers in one commit are all tracked against that SHA. Use the
**exact** task description — the hook matches by equality (it only trims
whitespace), so a reworded header fails to resolve; copy the heading verbatim
and never reword the markdown description once commits reference it.

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
- [ ] `## Architecture Alignment` is filled from a live read of `ARCHITECTURE.md`: one row per bearing principle recording the design consequence (what it ruled out / forced), no bare "✓" rows or copied principle list, and a resolved `**Deviations:**` line (`none` or ADR links)
- [ ] PRD, features, and tasks all created via `tiny-brain work add` (no hand-written `id:` / `uuid:`; `status:` lines never read or edited — status is git-derived)
- [ ] Slug is unique and in kebab-case
- [ ] Purpose clearly states the problem
- [ ] Current-state claims are grounded — `path:line` citations from reading the code, not analogy
- [ ] Cross-feature seams name the actual symbol + file + introducer/consumer (not prose-only "depends on F1")
- [ ] Each feature states its non-goals; judgement calls made without the user are recorded as Assumptions
- [ ] User needs include specific user stories
- [ ] Each feature has its own markdown file
- [ ] Acceptance criteria are testable — phrased as observable input→output statements a failing test can be written from
- [ ] Task descriptions are plain prose (no backticks/backslashes/quotes) and treated as frozen once work starts
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
   tiny-brain work add prd code-quality-analysis "Code Quality Analysis"
   tiny-brain work add feature --prd code-quality-analysis quality-service "Quality Service"
   tiny-brain work add feature --prd code-quality-analysis quality-cli "Quality CLI"
   tiny-brain work add task --feature quality-service "Add metric collector"
4. Fill in Description / Acceptance Criteria with Edit
5. Commit; the PRD is now visible in the dashboard
```
