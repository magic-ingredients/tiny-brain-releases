<!--
BODY-STRUCTURE REFERENCE for the /plan skill — NOT a file to copy.

`tb work add prd <slug> "<title>"` CREATES docs/prd/<slug>/prd.md with the
frontmatter already written: id, uuid, title, status, created, updated. The
CLI owns the frontmatter — do NOT add or hand-edit it, and never type a `uuid:`.

This template shows the PROSE SECTIONS to flesh out with the Edit tool after the
file exists. The rendered file ships with a minimal scaffold (Purpose, Features);
expand it toward the shape below. Delete any section that doesn't apply.
-->

# [PRD Title]

## Purpose and Goals

[What problem does this PRD solve? What outcomes mark it done?]

- Enable [capability X]
- Provide [benefit Y]
- Support [use case Z]

## User Needs

### Target Audience
[Who are the primary users? Who benefits from this work?]

### User Stories
1. As a [role], I want to [action] so that [benefit]
2. As a [role], I want to [action] so that [benefit]

## Features and Functionality

[Each feature is created with `tb work add feature --prd <slug> <feature-slug> "<title>"`,
which writes its own file under features/. Summarise them here.]

### [Feature Name]
**File**: [features/feature-slug.md](features/feature-slug.md)
**Description**: [Brief description of what this feature does]

## Release Criteria

### Functional Requirements
- [ ] Requirement 1

### Usability Requirements
- [ ] Requirement 1

### Technical Requirements
- [ ] Requirement 1

## Success Metrics (KPIs)

- Metric 1: [target value]

## Constraints and Dependencies

### Technical Constraints
- Constraint 1

### Dependencies
- Dependency 1

### Known Limitations
- Limitation 1
