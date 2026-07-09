# Quality Report Template

**MANDATORY** output format for all agents invoked in quality mode (`--quality`).

## JSON Schema

Your `--json` argument to `tiny-brain _review persist` MUST be a single JSON object with this exact shape:

```json
{
  "agentId": "<step-type>",
  "timestamp": "<ISO 8601>",
  "durationMs": <number>,
  "summary": {
    "filesAnalyzed": <number>,
    "issueCount": <number>,
    "bySeverity": { "critical": 0, "major": 0, "minor": 0, "info": 0 }
  },
  "issues": [ <QualityIssue>, ... ],
  "structuredRecommendations": [ <StructuredRecommendation>, ... ],
  "metadata": {}
}
```

**CRITICAL RULES:**
- The top-level value MUST be an object — NOT a bare array
- `agentId` MUST match the step type (e.g., `security`, `code-quality`, `testing`) — NOT the agent name
- `issues` is the ONLY array of findings — do NOT use `suggestions`, `findings`, or any other key
- `structuredRecommendations` is the ONLY array of remediations — see "Worth-doing Recommendations" below
- ALL string values in `evidence` fields MUST have backslashes and quotes properly escaped for JSON
- `source` on every issue MUST be `"llm"`

## QualityIssue Schema

Each item in the `issues` array:

```json
{
  "category": "Security | Reliability | Performance | Maintainability | Testing | Architecture | Documentation | Operations",
  "severity": "critical | major | minor | info",
  "file": "relative/path/to/file.ts",
  "line": 42,
  "message": "Clear description of the issue",
  "suggestion": "Actionable fix recommendation",
  "evidence": "Properly escaped code snippet showing the problem",
  "ruleId": "AGENT-001",
  "source": "llm",
  "effort": "trivial | small | medium | large | epic",
  "effortHours": 2,
  "theme": "thematic-tag",
  "scoreImpact": 5
}
```

## Agent-Specific Extra Fields

Some agents add extra top-level fields alongside the standard schema:

| Agent | Extra Fields |
|-------|-------------|
| coverage | `packageBreakdown`: `{ "pkg-name": { "pct": 87.5 } }`, `overallCoverage`: `45.2` (average %), `skippedTests`: `19` (skipped/todo count) |

These are additive — the core `{ agentId, issues }` shape must still be present.

## Worth-doing Recommendations

Alongside `issues`, you MUST emit a top-level `structuredRecommendations` array.
Where each **issue** is a single problem you found, each **recommendation** is a
higher-level unit of remediation worth doing — it may resolve one or many issues.
The dashboard's "Worth-doing" column ranks these by risk reduced and renders
title / description / effort, so the wording must read as actionable work.

- Emit one recommendation per coherent piece of work, NOT one per issue. Group
  related issues (e.g. "add input validation across the auth module") into a
  single recommendation.
- If you found no issues worth recommending action on, emit an empty array
  (`"structuredRecommendations": []`) — never omit the key.
- Link a recommendation to the issues it addresses via `addressesIssues`
  (zero-based indices into your own `issues` array).

### StructuredRecommendation Schema

Each item in the `structuredRecommendations` array:

```json
{
  "title": "Short imperative summary of the work",
  "description": "What to do and why it reduces risk",
  "priority": "critical | high | medium | low (or a number 1-5)",
  "category": "Security | Reliability | Performance | Maintainability | Testing | Architecture | Documentation | Operations",
  "effort": "trivial | small | medium | large | epic",
  "estimatedScoreGain": 8,
  "effortHours": 4,
  "addressesIssues": [0, 3]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Short, imperative summary of the work |
| `description` | string | Yes | What to do and why it reduces risk |
| `priority` | string \| number | Yes | `critical`/`high`/`medium`/`low`, or a number 1–5 |
| `category` | string | Yes | Any string; prefer the `QualityIssue` category vocabulary (Security, Reliability, …) for consistent grouping |
| `effort` | string | No | `trivial`/`small`/`medium`/`large`/`epic` |
| `estimatedScoreGain` | number | No | Estimated quality-score points recovered if done |
| `effortHours` | number | No | Estimated hours to implement |
| `addressesIssues` | number[] | No | Zero-based indices into your `issues` array |

Malformed recommendations are silently dropped on assembly, so any
recommendation missing a required field will simply not appear in the report.

## What NOT to Do

- Do NOT return `{ "verdict": "...", "suggestions": [...] }` — that is the pipeline review format
- Do NOT return a bare JSON array `[...]` — wrap in the object envelope above
- Do NOT put unescaped newlines or backslashes in string values
