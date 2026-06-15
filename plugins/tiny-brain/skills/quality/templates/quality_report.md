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
  "metadata": {}
}
```

**CRITICAL RULES:**
- The top-level value MUST be an object — NOT a bare array
- `agentId` MUST match the step type (e.g., `security`, `code-quality`, `testing`) — NOT the agent name
- `issues` is the ONLY array of findings — do NOT use `suggestions`, `findings`, or any other key
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

## What NOT to Do

- Do NOT return `{ "verdict": "...", "suggestions": [...] }` — that is the pipeline review format
- Do NOT return a bare JSON array `[...]` — wrap in the object envelope above
- Do NOT put unescaped newlines or backslashes in string values
