<!--
BODY-STRUCTURE REFERENCE for the /plan skill — NOT a file to copy.

`tiny-brain work add prd <slug> "<title>"` CREATES docs/prd/<slug>/prd.md with the
frontmatter already written: id, uuid, title, status, created, updated. The
CLI owns the frontmatter — do NOT add or hand-edit it, and never type a `uuid:`.

This template shows the PROSE SECTIONS to flesh out with the Edit tool after the
file exists. The rendered file ships with a minimal scaffold (Purpose, Features);
expand it toward the shape below. Delete any section that doesn't apply.
-->

# [PRD Title]

## Purpose and Goals

[What problem does this PRD solve? What outcomes mark it done? Ground every
claim about how the system behaves TODAY in a `path:line` citation from reading
the code — a PRD written from analogy ("mirror how X does it") without opening X
describes a system that doesn't exist.]

- Enable [capability X]
- Provide [benefit Y]
- Support [use case Z]

**Non-goals:** [what this PRD deliberately does NOT do — the scope edge a
bounded worker must not cross. One line per exclusion.]

## User Needs

### Target Audience
[Who are the primary users? Who benefits from this work?]

### User Stories
1. As a [role], I want to [action] so that [benefit]
2. As a [role], I want to [action] so that [benefit]

## Features and Functionality

[Each feature is created with `tiny-brain work add feature --prd <slug> <feature-slug> "<title>"`,
which writes its own file under features/. Summarise them here. Keep each feature to **one
worker run** and declare any ordering between them — see `docs/deliverability-rubric.md`.]

### [Feature Name]
**File**: [features/feature-slug.md](features/feature-slug.md)
**Description**: [Brief description of what this feature does]

## Architecture Alignment

[Read [`ARCHITECTURE.md`](../../../ARCHITECTURE.md) and add **one row per
principle that bore on this design**. Each row records the *design consequence* —
what the principle pushed into the pure-function core, what alternative it
**ruled out**, what shape it forced on the adapters/ports. A named rejected
alternative is the evidence the principle was load-bearing; a bare "✓ conforms"
is not. **The three rows below are illustrative only — DELETE them and write your
own from a live read of `ARCHITECTURE.md`.** Keeping them verbatim is exactly the
copied-principle-list anti-pattern the `/plan` skill tells you to reject; the doc
is the single source of truth and any list restated here drifts.]

<!-- ⬇ EXAMPLE ROWS — delete these; they are not the canonical principle set. -->
| Principle (from ARCHITECTURE.md) | Design consequence — what it ruled out / forced |
|----------------------------------|-------------------------------------------------|
| Stateless pure-function core | Projection logic lives in core as pure functions; ruled out reading git/fs inside it — the adapter passes state in and renders the returned result. |
| Thinnest possible adapters | The CLI command only parses argv and prints; ruled out putting the branch-resolution logic in the command, which moved to a core `resolve*` function. |
| Git as source of truth | Status is derived from commits, never stored; ruled out a mutable `status` field the CLI writes — the hook projects it from history instead. |

**Deviations:** [`none`, or one link per deviation to the ADR that records it — mirroring `ARCHITECTURE.md`'s closing rule. Use the `/adr` skill to create the ADR if one doesn't exist.]

## Release Criteria

### Functional Requirements
- [ ] Requirement 1

### Usability Requirements
- [ ] Requirement 1

### Technical Requirements
- [ ] Requirement 1

## Success Metrics (KPIs)

[Observable post-land signals someone can measure, not marketing KPIs — e.g.
"zero orphaned Stryker workers after a completion run", "/runs responds <200ms
warm". Each names WHERE it is observed.]

- Metric 1: [observable signal + target + where measured]

## Constraints and Dependencies

### Technical Constraints
- Constraint 1

### Dependencies
- Dependency 1

### Known Limitations
- Limitation 1

### Assumptions

[Every judgement call made without the user — especially when authoring
autonomously, where clarifying questions dead-end. Each is one line a human can
veto; an unstated assumption is how a spec silently drifts from intent.]

- Assumption 1: [what was assumed, and what changes if it's wrong]
