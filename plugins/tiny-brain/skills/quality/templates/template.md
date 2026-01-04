# Quality Run Output Template

This template defines the markdown format for quality run reports saved to `docs/quality/runs/`.

## File Naming

Files are named with the pattern: `YYYY-MM-DD-quality.md`

Example: `2025-01-03-quality.md`

## Template Structure

```markdown
---
run_date: {{DATE}}
score: {{SCORE}}
grade: {{GRADE}}
issue_count: {{ISSUE_COUNT}}
---

# Quality Run - {{DATE}}

## Summary

**Score:** {{SCORE}}/100
**Grade:** {{GRADE}}
**Issues Found:** {{ISSUE_COUNT}}

{{#if PREVIOUS_RUN}}
### Comparison to Previous Run
- Previous Score: {{PREVIOUS_SCORE}}
- Change: {{SCORE_CHANGE}} ({{CHANGE_DIRECTION}})
{{/if}}

## Category Breakdown

| Category | Issues | Impact |
|----------|--------|--------|
{{#each CATEGORIES}}
| {{name}} | {{issue_count}} | -{{deduction}} |
{{/each}}

## Issues by Severity

### Critical
{{#each CRITICAL_ISSUES}}
- **{{file}}:{{line}}** - {{message}}
  - Category: {{category}}
  - Suggestion: {{suggestion}}
{{/each}}

### Major
{{#each MAJOR_ISSUES}}
- **{{file}}:{{line}}** - {{message}}
  - Category: {{category}}
  - Suggestion: {{suggestion}}
{{/each}}

### Minor
{{#each MINOR_ISSUES}}
- **{{file}}:{{line}}** - {{message}}
  - Category: {{category}}
{{/each}}

## Recommendations

{{#each RECOMMENDATIONS}}
{{@index}}. {{this}}
{{/each}}

## Repository Context

- **Languages:** {{LANGUAGES}}
- **Frameworks:** {{FRAMEWORKS}}
- **Project Type:** {{PROJECT_TYPE}}

## Raw Data

\`\`\`json
{
  "runId": "{{RUN_ID}}",
  "date": "{{DATE}}",
  "score": {{SCORE}},
  "grade": "{{GRADE}}",
  "issueCount": {{ISSUE_COUNT}},
  "issues": {{ISSUES_JSON}},
  "recommendations": {{RECOMMENDATIONS_JSON}},
  "context": {{CONTEXT_JSON}}
}
\`\`\`
```

## Template Variables

| Variable | Type | Description |
|----------|------|-------------|
| DATE | string | ISO date (YYYY-MM-DD) |
| SCORE | number | 0-100 quality score |
| GRADE | string | A, B, C, D, or F |
| ISSUE_COUNT | number | Total issues found |
| CATEGORIES | array | Category breakdown |
| CRITICAL_ISSUES | array | Severity = critical |
| MAJOR_ISSUES | array | Severity = major |
| MINOR_ISSUES | array | Severity = minor |
| RECOMMENDATIONS | array | Improvement suggestions |
| LANGUAGES | string | Comma-separated list |
| FRAMEWORKS | string | Comma-separated list |
| PROJECT_TYPE | string | library, app, monorepo |
| RUN_ID | string | Unique run identifier |
| *_JSON | string | JSON-stringified data |

## Implementation Note

The QualityService uses this structure when generating run output. The actual implementation is in:
- `packages/tiny-brain-core/src/services/quality/quality-service.ts`

The template is provided here for documentation and customization reference.
