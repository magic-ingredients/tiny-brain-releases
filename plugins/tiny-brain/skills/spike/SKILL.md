---
name: spike
version: 2.0.0
description: Create a time-boxed spike — throwaway exploration to answer a concrete question. Use when the user wants to try an approach quickly to see if it's viable, before committing to a PRD or fix. Triggers on phrases like "spike", "let me try", "is X viable", "can we do Y", "prototype this".
allowed-tools: Read, Edit, Bash(tiny-brain:*), Bash(tb:*), Bash(git checkout:*), Bash(git worktree:*), Bash(git rev-parse:*), Bash(basename:*), Bash(dirname:*), AskUserQuestion
---

# Spike Creation Skill

## Identity model: slugs and UUIDs

The spike and each of its tasks carry a stable **UUIDv7** as their real
identity, which `tb work add` generates and stamps into the markdown — you never
type one. Humans refer to a spike by its **slug** and to a task by its
**description**, which the tooling resolves to the UUID internally. So **create
the spike doc and its tasks through `tb work add`**, then Edit in the
spike-specific details the CLI can't know (the real question, criteria, timebox,
worktree link, and `pipelineType: spike`).

## When to Use

Create a spike when the user is:
- About to start a complex PRD and wants to de-risk the riskiest assumption first
- Mid-planning and realises "we should just try this" rather than spec further
- Evaluating a third-party library, API, or integration before wiring it deep
- Asking whether an approach is viable, with a specific question and a clear "yes/no" answer they want

**Do NOT** use the spike skill for:
- Bug fixes (use `/fix`)
- Production features (use `/plan`)
- Anything where the resulting code is intended to ship

A spike's value is the **answer**, not the code. The code is throwaway. A spike that proves the approach *won't* work is just as successful as one that proves it will.

## Spike Layout

Spike docs live under `docs/spikes/` (one file per spike, flat layout — no enclosing directory):

```
docs/spikes/multi-provider-connectivity.md         # the spec, versioned
.git/tiny-brain/spikes/multi-provider-connectivity.json  # progress, per-clone
```

The skill creates ONLY the markdown doc (via `tb work add spike`). Progress JSON is materialised by `tb task sync` in the final step.

## Workflow

### Step 1: Parse the Prompt Into a Question

The spike is question-driven. Read the user's prompt and identify the single concrete question the spike will answer. The question must be:

- **One sentence.** If it doesn't fit, the spike scope is wrong — push back and ask the user to narrow.
- **Answerable yes/no** (or with a specific finding). "Can we drive Codex CLI through the same worker interface as Claude Code?" — good. "Explore the worker abstraction" — too vague.
- **Specific to the codebase.** "Can React 19 work here?" beats "Should we use React 19?".

State your interpretation back to the user before proceeding. If the question is ambiguous, ask a clarifying question first — do NOT proceed with a guess.

### Step 2: Propose Acceptance Criteria (AskUserQuestion)

Propose 2–5 acceptance criteria that operationalise the question into observable checks. Each criterion is a specific, observable result that decides validated vs invalidated.

Good criteria:
- "Codex CLI runs from the same worker config that runs Claude Code"
- "Tool-use events surface in tb's event stream uniformly across providers"
- "Provider failures are distinguishable in error output"

Bad criteria (too vague):
- "It works"
- "Performance is acceptable"
- "Code is clean"

Use `AskUserQuestion` with the proposed criteria as the options, plus "Edit before continuing" as an option. If the user picks edit, gather their amendments and re-propose.

### Step 3: Propose Initial Tasks (AskUserQuestion)

Propose 2–6 initial tasks (lean toward fewer for short timeboxes — 2–3 tasks for a 2h spike, up to 6 for a 1–2d spike). All spike tasks use `pipelineType: spike`. Each task is one complete cycle of spike work — a probe, a measurement, a rendered diagram, or a written-up finding.

**Tasks MUST:**
- Produce a commit (working code, measurement output, or written analysis).
- Be implementable as a single `green → refactor → spike-review` cycle.
- Be ordered roughly by sequence of investigation (early tasks unblock later ones).

**Tasks MUST NOT:**
- Split into "write test for X" + "implement X" — spike tasks have NO red phase.
- Be manual / verification-only ("user looks at the chart", "discuss findings"). Manual checks are part of finishing a task, not a task themselves.
- Be larger than 1–2 hours of work each. If a task feels big, split it.

Use `AskUserQuestion` with the proposed tasks as options, plus an edit-and-iterate path. Confirm the final list before writing the doc.

### Step 4: Propose Timebox (AskUserQuestion)

Default: `2h` for narrow questions, `4h` for broader ones, `1d` for spikes that touch multiple subsystems. Hard ceiling: `2d`.

Use `AskUserQuestion` with three options (e.g. "2h", "4h", "1d") plus "Other" for custom values. The timebox is a hard cap — when it elapses, the spike transitions to a terminal status regardless of completeness. `abandoned` is a valid and honourable outcome.

### Step 5: Worktree or Branch-Only? (AskUserQuestion)

Use `AskUserQuestion` with two options:

- **"Worktree (Recommended)"** — Creates a sibling checkout at `../<repo-basename>-spike-<id>`. Lets the user keep their main checkout untouched while the spike runs in parallel. Best for spikes that touch many files or run a dev server.
- **"Branch only"** — Just creates the spike branch. Best for one-file probes or when the user explicitly prefers single-tree workflow.

Default recommendation: worktree. The launch snippet (Step 9) makes worktree mode one-click.

### Step 6: Slug the Spike ID

Derive a kebab-case id from the question. Strip articles, stopwords, and punctuation:

- "Can we drive Codex CLI through the worker abstraction?" → `codex-cli-worker-abstraction`
- "Does the SSE client recover from network drops?" → `sse-client-network-drop-recovery`

Then check three things in order:

1. **Doc collision:** if `docs/spikes/{id}.md` already exists, append today's ISO date (`{id}-YYYY-MM-DD`). If THAT also collides, append a numeric suffix (`{id}-YYYY-MM-DD-2`, `-3`, …) until you find a free slot.
2. **Branch collision:** if the branch `spike/{id}` already exists locally (`git rev-parse --verify spike/{id}` succeeds), STOP. Do not auto-suffix — a pre-existing branch likely means a prior aborted spike. Surface the situation to the user and let them decide: delete the old branch, reuse it, or pick a different id.
3. **Worktree path collision:** if the computed worktree path (Step 8) already exists on disk, STOP for the same reason — the prior spike's worktree is still around.

Confirm the chosen id with the user before writing.

### Step 7: Create the Branch (and Worktree)

The branch — and, in worktree mode, the worktree — must exist **before** the doc is written, so that the doc lands in the working tree the user will actually `cd` into. Writing the doc first and then trying to `git worktree add` the same branch fails (the branch would already be checked out in the current tree), and even if it didn't, the doc would be stranded in the original tree, invisible to the worktree.

**Branch-only mode:**

```bash
git checkout -b spike/{id}
```

Capture the target dir for Step 8:

```bash
TARGET_DIR=$(git rev-parse --show-toplevel)
```

**Worktree mode:** create the branch and the worktree in one shot from the current branch, *without* switching the current tree. Place the worktree next to the **main repo**, not next to the current working directory — the skill may be invoked from inside another worktree, and a naive `git rev-parse --show-toplevel` would return that nested worktree's path instead of the canonical repo root. Use `--git-common-dir` to find the shared `.git` and derive the main repo from its parent:

```bash
# Resolve the canonical main-repo location regardless of which worktree
# the skill is invoked from. --git-common-dir returns the shared .git
# directory (the same one for every worktree of this clone); its parent
# is the main checkout.
MAIN_REPO=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
REPO_BASENAME=$(basename "$MAIN_REPO")
WORKTREE_PATH="${MAIN_REPO}/../${REPO_BASENAME}-spike-{id}"
git worktree add -b spike/{id} "${WORKTREE_PATH}"
TARGET_DIR="${WORKTREE_PATH}"
```

`git worktree add -b` creates the branch AND the worktree atomically — no second checkout, no chance of the branch being claimed by two trees. The resulting worktree is always a sibling of the main repo, whether the skill was invoked from main or from another worktree.

If either command fails because the branch already exists, surface the git error verbatim — do not auto-rename. Step 6's branch-collision check should have caught this; if it didn't, the user has just decided to ignore the warning. Either way, ask the user how to proceed.

### Step 8: Create the Spike Doc and Tasks

Create the doc inside `$TARGET_DIR` from Step 7 — the working tree that will host
the spike work — so it lands in the tree the user will `cd` into. Run `tb work
add` from there so the repo root resolves to that tree:

```bash
cd "${TARGET_DIR}" && tb work add spike {id} "Spike Title"
```

This writes `docs/spikes/{id}.md` with the frontmatter filled in — `id`, the
generated `uuid`, `title`, `status: not_started`, `created` (ISO timestamp),
`outcome: null`, and **placeholder** `question` / `acceptanceCriteria` / `timebox`
values. The CLI owns `id` / `uuid` / `created`; never type them.

Then use the **Edit** tool to replace the placeholders with the real values you
gathered in Steps 1–4:

- `question` — the one-sentence question from Step 1
- `acceptanceCriteria` — the list from Step 2
- `timebox` — the value from Step 4
- `worktree: { name, branch }` — add this block ONLY if Step 5 was "Worktree"

Leave `status: not_started` as written — `tb task sync` (Step 9) derives the
container status from the child tasks; setting `in_progress` when no tasks have
started would diverge from what sync writes back.

Add each task from Step 3 with `tb work add task --spike`:

```bash
cd "${TARGET_DIR}" && tb work add task --spike {id} "Probe the approach"
```

Each task block gets its own generated `uuid:`. The first `tb work add task`
appends a `## Tasks` section to the doc — and because the rendered spike doc ends
with `## Outcome`, the new section lands **below** `## Outcome`. That's
functionally fine (the task extractor is section-position-agnostic); reorder it
above `## Outcome` with Edit if you prefer.

**The CLI defaults a new task to `pipelineType: standard`** — it does not know
this is spike work — so for every task you add, Edit its block to insert
`pipelineType: spike` on the line after `status: not_started`:

```
### 1. Probe the approach
id: <generated-uuid>
status: not_started
pipelineType: spike
```

Without it the task runs the full TDD pipeline (red phase and all) instead of the
minimal spike pipeline.

### Step 9: Sync Progress

Run `task sync` from inside `$TARGET_DIR` so that git context resolves to the spike's worktree (the progress JSON lives under the shared `.git/tiny-brain/`, so it's visible from any worktree of this clone, but `task sync` reads the doc by relative path):

```bash
cd "${TARGET_DIR}" && tiny-brain task sync docs/spikes/{id}.md
```

This materialises the per-spike progress JSON at `.git/tiny-brain/spikes/{id}.json`. The dashboard picks it up immediately via its file watcher.

### Step 10: Output Summary

Print this summary to the user (substitute `{id}`, dashboard URL, and worktree-path):

```
🧪 Spike created: {id}
📊 Dashboard: http://localhost:8765/spikes/{id}
```

If the user chose worktree, append the launch snippet on a separate line so it's one-click copyable:

```
🚀 Launch in worktree:
    cd ../{repo-basename}-spike-{id} && claude
```

If `package.json` exists in the repo root, also append:

```
💡 First run in the worktree: npm install
```

## Spike Pipeline (Reference)

Spike tasks (`pipelineType: spike`) flow through a deliberately minimal pipeline:

```
green       → write minimal code that exercises the question
refactor    → optional cleanup before review
spike-review → validity check by tiny-brain:spike-reviewer
              ("could this code mislead the conclusion?")
              ↓
            either: refactor (back to green-style) and re-review
            or:     task complete
```

Compared to standard TDD: NO red phase, NO coverage/mutation/quality reviews, ONE focused validity-check review. This is intentional. Spike code is throwaway; review only guards against "obviously wrong" findings, not full production quality.

### Commit-type prefix for spike work

Use `spike:` as the conventional-commit prefix on every spike commit. The commit-msg hook requires `Spike:` + `Task:` headers on every `spike:` commit — there is no opt-out (spike work is tracked by nature). Skip tests-pass enforcement: spike code is throwaway and the hook treats `spike:` like `chore:`/`docs:` for the test-execution gate.

```
spike(scope): explore approach

Spike: my-spike-id
Task: Probe the approach
```

The `Task:` value is the **task description as it appears in the spike
markdown** — the commit-msg hook resolves it to the task's UUID at hook time.
Use the exact description: the hook matches by equality (trimming whitespace and
tolerating escaped backticks only), so a reworded header fails to resolve.
(During the migration soak the legacy positional `task-N` form is still
accepted, but new commits should use the description.)

`feat:` still works for spike-tracked commits where you genuinely want the GREEN-phase semantics — the post-commit pipeline triggers `spike-review` after `feat:` commits with a `Spike:` header. Use `feat:` when you want the review fired, `spike:` when you want a lightweight exploratory landing without the review trigger.

## Completing a Spike

When the user reaches a conclusion (answer to the question), they MUST:

1. Fill in the `## Outcome` section at the bottom of the spike doc:
   - **Status decision:** `validated` | `invalidated` | `abandoned`
   - **Summary:** one paragraph — what was learned, what was decided, why
   - **Evidence:** links to commits / measurements / specific findings
   - **Follow-up:** the next concrete step (new PRD, fix doc, do nothing)

2. Update the frontmatter — **flip BOTH fields together**:
   - `status: validated` (or `invalidated` / `abandoned`)
   - `outcome: true` (the flag declares the Outcome section is filled)

   ⚠️ **Cross-field rule:** a terminal status (`validated`/`invalidated`/`abandoned`) requires `outcome: true`; a non-terminal status (`not_started`/`in_progress`) requires `outcome: null`. The schema enforces this; flipping only one of the two causes `task sync` to refuse the write. The first user of this surface (the `headless-claude-worker-probe` spike) hit a silent skip because they flipped `status` without `outcome`; the CLI now exits non-zero with a structured error.

3. Run `tiny-brain task sync docs/spikes/{id}.md`. The schema rejects a terminal status without `outcome: true` (and vice versa — open status with `outcome: true`). The Outcome MARKDOWN SECTION is a convention the schema does NOT enforce — the flag is the only contract. Discipline around actually filling the section is on the author; reviewers should spot-check during the spike-review gate.

4. **Graduate the outcome to `main`** so the dashboard's main-card reader sees `status: validated/invalidated/abandoned` + the filled Outcome section. Spike branches are throwaway — without graduation, the doc dies with the worktree and the parent repo's view stays frozen at `not_started`:

   ```bash
   tiny-brain spike graduate {id}
   ```

   Run this from **inside the spike worktree**. The command:
   - Reads `docs/spikes/{id}.md` from the spike branch and refuses unless it's in a terminal status with `outcome: true`.
   - Lands a single-file commit on `main` carrying `Spike: {id}` + `Task: Outcome write-up` headers (NOT a plain `chore:` — the headers keep the spike's audit trail consistent across the branch boundary). Conventional-commit prefix is `chore(spike):` so the post-commit pipeline doesn't try to re-run review on the just-graduated doc.
   - Uses `git checkout {spike-branch} -- docs/spikes/{id}.md` under the hood — your other staged/untracked work on `main` is left alone. (Caveat: don't edit `docs/spikes/{id}.md` itself on main while graduate is running — that one file gets overwritten with the spike-branch version.)
   - Re-runs `sync-file` on the main side so the dashboard updates immediately.
   - Idempotent: re-running when `main` is already up-to-date exits 0 with "already graduated".

`validated` and `invalidated` are equally successful outcomes — a "no, this approach doesn't work" answer is exactly what spikes are for. Only `abandoned` (ran out of timebox without a clear answer) is the ambiguous case.

**Don't auto-remove the spike worktree.** The `spike-evidence/` directory and the spike branch's intermediate commits are the audit trail for the outcome — keep them rescue-able. If the user explicitly asks to clean up later, `git worktree remove ../{repo-basename}-spike-{id}` from the main repo does it; the branch + history remain in the clone.

## Quality Checklist

Before declaring a spike fully scaffolded, verify:

- [ ] The question fits in one sentence and is answerable yes/no.
- [ ] At least one acceptance criterion is observable (not vague).
- [ ] All tasks have `pipelineType: spike` Edited in (on the line after `status: not_started` in each `### N.` task block).
- [ ] The branch `spike/{id}` exists.
- [ ] If worktree mode: the worktree path exists and `git worktree list` shows it.
- [ ] `docs/spikes/{id}.md` exists and validates against the spike schema (auto-checked by `tb task sync`).
- [ ] `.git/tiny-brain/spikes/{id}.json` exists after `tb task sync` (confirms progress was materialised).
- [ ] Doc `status` and synced JSON `status` agree (both `not_started` at creation time).
- [ ] The output summary names the spike id, dashboard URL, and (if worktree) the launch snippet.

## Template

- Spike body structure: `templates/spike-template.md` (reference, not a file to copy — `tb work add spike` renders the doc; the template shows the target shape and the spike-specific frontmatter you Edit in)

## Example

```
User: "/spike can we drive Codex CLI through the same worker interface as Claude Code"

Claude:
1. Parse question: "Can we drive Codex CLI through the same worker interface
   as Claude Code without provider-specific branches in tb?"
2. Propose criteria (AskUserQuestion):
   - Codex runs from the same worker config that runs Claude Code
   - Tool-use events surface uniformly in tb's event stream
   - Provider failures are distinguishable in error output
3. Propose tasks (AskUserQuestion):
   - Stub provider trait
   - Wire Codex into worker dispatch
   - Compare event streams across providers
4. Propose timebox (AskUserQuestion): "4h"
5. Worktree? (AskUserQuestion): "Worktree (Recommended)"
6. Slug id: codex-cli-worker-abstraction
7. MAIN_REPO=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
   REPO_BASENAME=$(basename "$MAIN_REPO")
   WORKTREE_PATH="${MAIN_REPO}/../${REPO_BASENAME}-spike-codex-cli-worker-abstraction"
   git worktree add -b spike/codex-cli-worker-abstraction "${WORKTREE_PATH}"
   TARGET_DIR="${WORKTREE_PATH}"
8. cd "${TARGET_DIR}" && tb work add spike codex-cli-worker-abstraction "Codex CLI worker abstraction"
   Edit the doc: real question + acceptanceCriteria + timebox + worktree block
   cd "${TARGET_DIR}" && tb work add task --spike codex-cli-worker-abstraction "Stub provider trait"
   Edit each task block to add pipelineType: spike
9. cd "${TARGET_DIR}" && tiny-brain task sync docs/spikes/codex-cli-worker-abstraction.md
10. Output:
    🧪 Spike created: codex-cli-worker-abstraction
    📊 Dashboard: http://localhost:8765/spikes/codex-cli-worker-abstraction
    🚀 Launch in worktree:
        cd ../tiny-brain-local-spike-codex-cli-worker-abstraction && claude
    💡 First run in the worktree: npm install
```
