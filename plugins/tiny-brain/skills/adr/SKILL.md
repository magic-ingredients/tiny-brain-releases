---
name: adr
version: 1.0.0
description: Create an Architecture Decision Record. Use when making significant architectural or technical decisions that should be documented.
---

# ADR Creation Skill

## When to Use

Create an ADR when making decisions about:
- Architecture patterns (microservices, event-driven, etc.)
- Technology selection (databases, frameworks, libraries)
- Infrastructure choices (cloud providers, IaC tools, CI/CD)
- Security approaches (authentication, authorization)
- API design (REST vs GraphQL, versioning)
- Development workflows and standards

## Workflow

### Step 1: Gather Decision Context

Extract from conversation:
- **Decision**: What was decided?
- **Context**: Why is this decision needed?
- **Constraints**: Technical, time, budget, team limitations
- **Alternatives**: All options discussed (including rejected ones)
- **Validation**: Any tests, prototypes, or benchmarks

### Step 2: Determine ADR Number

```bash
ls docs/adr/*.md | grep -E '[0-9]{4}' | sort | tail -1
# Increment by 1 for the new ADR
```

### Step 3: Create ADR Directory (if needed)

```bash
mkdir -p docs/adr
```

### Step 4: Create ADR File

Use the template at `templates/adr-template.md`.

**File naming:** `NNNN-decision-title-in-kebab-case.md`
- `0001-use-postgresql-for-data-storage.md`
- `0042-adopt-event-sourcing-pattern.md`

**YAML Frontmatter:**
```yaml
---
adr_number: N
title: "Decision Title"
date: YYYY-MM-DD
status: proposed
supersedes: null
superseded_by: null
tags: [infrastructure, database]
decision_makers: [names if mentioned]
---
```

### Step 5: Fill Out Sections

1. **Status**: Current state (proposed/accepted/deprecated/superseded)
2. **Context**: Problem, constraints, background
3. **Decision**: What was chosen (clear, declarative language)
4. **Consequences**: Positive, negative, and neutral outcomes
5. **Alternatives Considered**: All options with pros/cons and rejection reasons
6. **Validation**: Tests performed, metrics collected
7. **References**: Links to code, docs, discussions

### Step 6: Confirm Creation

Tell the user:
> "I've created ADR-{N}: '{title}' at `docs/adr/{filename}`"

## Quality Checklist

- [ ] All YAML frontmatter fields filled
- [ ] Status is appropriate (proposed vs accepted)
- [ ] Context explains WHY this decision is needed
- [ ] Decision is clear and specific
- [ ] At least 2-3 alternatives documented
- [ ] Each alternative has pros, cons, rejection reason
- [ ] All three consequence types considered
- [ ] ADR number is sequential
- [ ] File name matches convention

## Template

- ADR: `templates/adr-template.md`

## Status Values

| Status | Meaning |
|--------|---------|
| `proposed` | Under consideration |
| `accepted` | Approved and active |
| `deprecated` | No longer recommended |
| `superseded` | Replaced by newer ADR |

## Example

```
User: "Let's use PostgreSQL for this project"

Claude:
1. Ask: "What drove this decision? What alternatives did you consider?"
2. Discuss: "Any specific requirements like JSONB, full-text search?"
3. Create:
   - docs/adr/0001-use-postgresql-for-data-storage.md
   - Document context, decision, alternatives (MySQL, MongoDB)
4. Confirm: "Created ADR-0001: Use PostgreSQL for Data Storage"
```
