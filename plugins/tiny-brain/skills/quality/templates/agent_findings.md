# Agent Findings Template

Standard output format for quality analysis agents. Every specialist agent writes a findings file
following this schema to the run directory.

## File Location

Agents read the file list from `{runDir}/files.txt` and write their findings to `{runDir}/agents/{agent-name}-output.json`.

The run directory is `docs/quality/runs/YYYY-MM-DD/HH-mm/`.

| Agent | Output File |
|-------|------------|
| security-quality-reviewer | `security-quality-reviewer-output.json` |
| performance-quality-reviewer | `performance-quality-reviewer-output.json` |
| testing-quality-reviewer | `testing-quality-reviewer-output.json` |
| code-quality-reviewer | `code-quality-reviewer-output.json` |
| MCP run-analysers | `analysis.json` |

## files.txt Format

The `files.txt` file contains one file path per line, with source files listed first,
followed by a `---TESTS---` separator, then test files:

```
src/auth.ts
src/api.ts
src/service.ts
---TESTS---
src/__tests__/auth.test.ts
src/__tests__/api.test.ts
```

Agents should read the appropriate section based on their domain:
- Security, Performance, Review agents: source files only (above `---TESTS---`)
- Testing agent: all files (both source and test files)

## Schema

```json
{
  "agentId": "string - agent that produced these findings (e.g. 'security', 'performance-reliability')",
  "timestamp": "ISO 8601 datetime",
  "durationMs": "number - execution time in milliseconds",
  "summary": {
    "filesAnalyzed": "number",
    "totalFiles": "number",
    "issueCount": "number",
    "bySeverity": {
      "critical": "number",
      "major": "number",
      "minor": "number",
      "info": "number"
    },
    "byCategory": {
      "Security": "number",
      "Reliability": "number",
      "Performance": "number",
      "Maintainability": "number",
      "Testing": "number",
      "Architecture": "number",
      "Documentation": "number",
      "Operations": "number"
    }
  },
  "issues": ["QualityIssue (see below)"],
  "metadata": "object - agent-specific metadata (see below)"
}
```

### QualityIssue Schema

```json
{
  "category": "string",
  "severity": "critical | major | minor | info",
  "file": "string - relative path",
  "line": "number (optional)",
  "message": "string",
  "suggestion": "string (optional)",
  "evidence": "string (optional)",
  "ruleId": "string",
  "source": "analyzer | llm",
  "effort": "trivial | small | medium | large | epic (optional)",
  "effortHours": "number (optional)",
  "theme": "string (optional)",
  "scoreImpact": "number (optional)",
  "references": ["string (optional)"]
}
```

### Agent-Specific Metadata

**Analyzer (MCP run-analysers):**
```json
{
  "metadata": {
    "analyzersRun": [
      {
        "analyzerId": "eslint",
        "name": "ESLint",
        "issueCount": 12,
        "status": "success",
        "durationMs": 3500
      }
    ]
  }
}
```

**Specialist agents:**
```json
{
  "metadata": {
    "checksPerFile": 7,
    "checklistVersion": "1.0"
  }
}
```
