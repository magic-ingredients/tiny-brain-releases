<!--
BODY-STRUCTURE REFERENCE for the /plan and /feature skills — NOT a file to copy.

`tiny-brain work add feature --prd <prd-slug> <slug> "<title>"` CREATES the feature file
with the frontmatter already written: id, uuid, prd_id, number, status, dates.
The CLI owns the frontmatter — do NOT add or hand-edit it, and never type a
`uuid:` or a `number:`.

Tasks are created with `tiny-brain work add task --feature <slug> "<description>"`, which
appends each task block with its own generated uuid (add `--prd <prd-slug>` only
to disambiguate a feature slug shared across PRDs). Do NOT hand-write task
blocks, per-task `status:`/SHA lines, or `task-N-M` ids — those are obsolete
under the UUID identity model.

This template shows the PROSE SECTIONS to flesh out with the Edit tool after the
file exists. Delete any section that doesn't apply.
-->

# Feature: [Feature Title]

## Description

[What does this feature deliver, why is it needed, and how does it fit the PRD?
Ground claims about today's behaviour in `path:line` citations from reading the
code — the spec transfers the author's context so the worker never re-derives
it.]

**Non-goals:** [what this feature deliberately does NOT do — the scope edge the
worker must not cross.]

## Acceptance Criteria

[Observable input→output statements, each phrased so it can be pasted as an
`it('...')` string — never a vague quality ("handles errors properly"). Use
checkboxes for tracking. The example below shows the shape — DELETE it and
write your own.]

- [ ] 'a page of terminal rows invokes the ratio projector only for the live rows'
- [ ] Criterion 2: [input → observable output]

## Deliverability

[This feature should be **one worker run**. Declare what affects delivery — full rules in
`docs/deliverability-rubric.md`.]

- **Single-run fit:** [one worker run? If not, how it splits — see `docs/deliverability-rubric.md` for sizing.]
- **Environment requirements:** [new dependencies, network, external services, Docker, global tools — blank if none.]
- **File contention:** [sibling features touching the same files — merge or sequence, and say which; blank if none.]
- **Base expectation:** [what must already be on the branch when the worker starts (a landed seam, a config key). If an expected seam is absent, the worker STOPS and reports — it never fabricates the seam.]

[Cross-feature seams and ordering go under **Dependencies** below.]

## Tasks

[Tasks are created via `tiny-brain work add task` — one per behaviour, full TDD cycle
inside (never a "write failing tests" / "implement" split, never a
verification-only task). Descriptions are plain prose (no backticks /
backslashes / quotes) and frozen once work starts.

Under each created task heading, add the detail block the worker executes from:]

**Files:** [each path verified to exist, or tagged NEW with the directory
convention that places it]
**First failing test:** ['the it-string the RED commit adds']
**Done when:** [observable outcome a reviewer can point at]

## Dependencies

[A cross-feature seam names the actual SYMBOL, the file it is exported from,
and who introduces vs consumes it — "depends on F1" alone cannot be
type-checked against. The example shows the shape — DELETE it and write your
own.]

- **Consumes** `MutationStepOutcome` from `packages/tiny-brain-core/src/services/mutation/fold-step-outcome.ts` — introduced by `mutation-run-verdict`; this feature lands after it.

## Testing Strategy

### Unit Tests
- ['it-string-shaped scenario, in the named test file']

### Integration Tests
- [Integration scenario — or "none; unit seams cover it" stated explicitly]

### Manual Testing

[Manual checks are part of FINISHING a standard task — never a task of their
own (the rubric bans verification-only tasks and mid-stream human gates). For a
UI-touching feature, populate this with the screenshot/story gate per
`ARCHITECTURE.md`'s UI components charter: a Storybook story per state, tested
through the accessible surface.]

- [e.g. screenshot of the changed surface against the mockup, attached before completion]

## Implementation Notes

[Gotchas that will bite THIS work — the operational knowledge the worker can't
cheaply discover (a fake-timer hazard in a touched test file, a dist rebuild a
changed package needs, a load-bearing ordering).]

- Note 1: [Important consideration]
