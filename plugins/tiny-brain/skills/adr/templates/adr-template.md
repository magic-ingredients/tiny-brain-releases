---
# ADR Metadata (YAML Frontmatter)
adr_number: 0
title: "Decision Title Here"
date: YYYY-MM-DD
status: proposed  # proposed | accepted | deprecated | superseded
supersedes: null  # ADR number if replacing another decision
superseded_by: null  # ADR number if this decision was replaced
tags: []  # e.g., [infrastructure, testing, backend]
decision_makers: []  # People involved in the decision
---

# ADR-{adr_number}: {title}

## Status

**{status}** (Date: {date})

<!-- Status values: proposed | accepted | deprecated | superseded -->
<!-- If superseded, reference the new ADR: "Superseded by ADR-XXX" -->
<!-- If superseding, reference the old ADR: "Supersedes ADR-XXX" -->

## Context

<!-- What is the issue we're facing? -->
<!-- What constraints exist (technical, business, team, time)? -->
<!-- What research/prototyping/experiments informed this decision? -->
<!-- What problem are we trying to solve? -->

### Background
<!-- Additional context about the situation -->

### Constraints
<!-- List key constraints that influenced the decision -->
- Constraint 1
- Constraint 2

## Decision

<!-- The decision that was made - be specific and concrete -->
<!-- Use clear, declarative language: "We will use..." -->

### Implementation Details
<!-- How will this decision be implemented? -->
<!-- Key technical specifics -->

## Consequences

### Positive Consequences
<!-- Benefits realized -->
<!-- Problems solved -->
- Benefit 1
- Benefit 2

### Negative Consequences
<!-- Trade-offs accepted -->
<!-- Technical debt incurred -->
<!-- Limitations introduced -->
- Trade-off 1
- Trade-off 2

### Neutral Consequences
<!-- Future work required -->
<!-- Dependencies created -->
<!-- Changes to team workflow -->
- Implication 1
- Implication 2

## Alternatives Considered

### Alternative 1: {Name}
**Description:** Brief description of this alternative

**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

**Rejection Reason:** Why this option was not chosen

---

### Alternative 2: {Name}
**Description:** Brief description of this alternative

**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

**Rejection Reason:** Why this option was not chosen

---

## Validation

<!-- How was this decision validated? -->
<!-- What tests/experiments were performed? -->
<!-- What metrics were collected? -->
<!-- What success criteria were met? -->

### Tests Performed
- Test 1
- Test 2

### Metrics Collected
- Metric 1: Value
- Metric 2: Value

### Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## References

<!-- Links to relevant resources -->
- [Prototype code](url)
- [Benchmark results](url)
- [Team discussion](url)
- [Related documentation](url)

## Notes

<!-- Any additional notes, future considerations, or follow-up items -->

---

**Related ADRs:**
- ADR-XXX: Related Decision
- ADR-YYY: Another Related Decision
