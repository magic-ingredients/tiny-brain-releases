<!--
BODY-STRUCTURE REFERENCE for the /spike skill — NOT a file to copy.

`tiny-brain work add spike <slug> "<title>"` CREATES docs/spikes/<slug>.md with the
frontmatter already written: id, uuid, title, status, created, outcome, plus
PLACEHOLDER question / acceptanceCriteria / timebox. The CLI owns id / uuid /
created — never type them. After creation, Edit the doc to replace the
placeholders with the real values (and add a `worktree:` block in worktree mode):

  question: The concrete question the spike answers in one sentence.
  acceptanceCriteria:
    - First criterion that decides validated vs invalidated
    - Second criterion (minimum one)
  timebox: 4h          # tight — most spikes finish in 2–4h, hard ceiling 2d
  worktree:            # optional — only when the spike runs in a separate checkout
    name: <slug>
    branch: spike/<slug>

The `outcome` flag is null while open, true once a terminal status is set; the
schema rejects a terminal status without outcome: true (and vice versa).

Tasks are created with `tiny-brain work add task --spike <slug> "<description>"`. The CLI
defaults each to pipelineType: standard — Edit each task block to add
`pipelineType: spike`. Do NOT hand-author task blocks or `task-N` ids.

This reference shows the body sections + the spike-specific frontmatter to Edit
in. Delete any section that doesn't apply.
-->

# Spike: [Short Title]

<!-- The `title` frontmatter field is the short label (a few words) used
     in lists and headings. The `question` frontmatter field is the full
     one-sentence question the spike answers. Don't conflate them. -->


## Question

[The concrete question. One sentence. If you can't write it in one
sentence, the spike scope is wrong — split it before you start.]

## Acceptance Criteria

[How will you know the question is answered? Each criterion below maps
to a row in the frontmatter `acceptanceCriteria` array.]

- Criterion 1: [Specific, observable result]
- Criterion 2: [Specific, observable result]

## Timebox

[Hard cap on effort. When the timebox elapses, the spike transitions to
a terminal status regardless of completeness — "abandoned" is a valid
outcome.]

**Limit:** [e.g. 2 days]
**Started:** [date]
**Deadline:** [date]

## Tasks

<!--
  Tasks are created with `tiny-brain work add task --spike <slug> "<description>"`,
  which appends a `## Tasks` section (below `## Outcome` in the rendered doc —
  reorder with Edit if you want it above) and a body block PER TASK shaped like:

      ### 1. <description>
      id: <generated-uuid>
      status: not_started
      pipelineType: spike          <- you Edit THIS line in; the CLI defaults
                                      the task to standard and does not add it

  `pipelineType: spike` runs green → spike-review (no RED, no full review
  pipeline) — it keeps project quality gates out of throwaway exploration.

  - DO write tasks that produce a commit (a probe, a measurement, a
    rendered diagram, a written-up finding).
  - DO NOT split tasks into "write test for X" + "implement X" —
    spike tasks have no RED phase.
  - DO NOT add manual / verification-only tasks (e.g. "user looks at
    chart"). They produce no commit and always end up superseded.
  - DO NOT hand-author the `### N.` / `id:` lines — `tiny-brain work add task` writes
    them; you only Edit in `pipelineType: spike`.
-->

## Outcome

<!--
  Fill in below when the spike reaches a terminal status. Then update
  the frontmatter:
    1. status: validated  (or invalidated / abandoned)
    2. outcome: true      (the flag declares the section below is filled)
    3. Run: tiny-brain task sync docs/spikes/{spike-id}.md

  Terminal status WITHOUT outcome: true is rejected by the schema.
  Filling this Outcome SECTION is a convention — the schema does not
  inspect the body. Discipline is on you.
-->

**Status decision:** [validated | invalidated | abandoned]

**Summary:** [One paragraph: what you learned, what you decided, why.]

**Evidence:** [Link to probes / measurements / commits that back the
decision. Specific is better than vague — "saw 10.4k events/sec on
prod-spec hardware in commit abc1234" beats "looks fast enough".]

**Follow-up:** [What's the next concrete step? A new PRD? A fix doc? A
recommendation to do nothing? Be explicit about what should happen
next — a spike without a follow-up call is unfinished thinking.]
