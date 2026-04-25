# Pipeline Report Template

**MANDATORY** output format for all agents invoked in pipeline mode (`--sha`).

## JSON Schema

Your `--json` argument to `npx tiny-brain persist` MUST be a single JSON object with this exact shape:

```json
{
  "summary": "1-2 sentence overall assessment",
  "verdict": "clean | needs-refactoring",
  "suggestions": [
    {
      "priority": "high | medium | low",
      "category": "string",
      "file": "relative/path/to/file.ts",
      "line": 42,
      "description": "Clear description of the issue",
      "rationale": "Why this matters",
      "suggestion": "Specific, actionable fix"
    }
  ]
}
```

**CRITICAL RULES:**
- `verdict` MUST be exactly `"clean"` or `"needs-refactoring"` — no other values
- `suggestions` is the ONLY array of findings — do NOT use `issues`, `findings`, or any other key
- ALL string values MUST have backslashes and quotes properly escaped for JSON

## Verdict Criteria

- **`clean`** — No actionable issues found
- **`needs-refactoring`** — Any suggestions worth addressing

## Priority Criteria

- **`high`** — Correctness issue: tests don't prove what they claim, missing error handling, type safety hole
- **`medium`** — Quality issue: over-engineering, naming confusion, unnecessary complexity
- **`low`** — Polish: minor simplification, small dead code removal

## Agent-Specific Fields

Some agents add extra top-level fields alongside the standard schema:

| Agent | Extra Fields |
|-------|-------------|
| coverage-reviewer | `overallCoverage`, `threshold`, `findings` (ScoringFinding array for step scoring) |

These are additive — the core `{ summary, verdict, suggestions }` shape must still be present.
