---
name: quality
version: 1.0.0
description: Run comprehensive code quality analysis on the repository. Performs weighted scoring across 8 categories using specialist agents.
allowed-tools: Read, Write, Bash(mkdir:*), mcp__plugin_tiny-brain_mcp__quality
---

# Quality Analysis Skill

## When to Use

Run a quality analysis when the user wants to:
- Assess overall code quality before a release
- Identify technical debt and improvement areas
- Track quality trends over time
- Prepare for a code review or audit
- Establish a quality baseline for a new project

## Workflow

### Step 1: Read Quality Standards

Read the quality criteria to understand what to check:

```bash
# Check for project-customized standards first
cat docs/quality/quality_criteria.md 2>/dev/null || cat templates/quality_criteria.md
```

This defines:
- 8 quality categories with weights
- Issue severity multipliers
- Standards for each category

### Step 2: Read Analysis Process

Read the process documentation:

```bash
cat templates/quality_process.md
```

This explains the 5-phase methodology:
1. Discovery - understand the codebase
2. Parallel Analysis - spawn specialist agents
3. Aggregation - combine findings
4. Scoring - calculate score and grade
5. Reporting - generate and persist results

### Step 3: Invoke Quality Coordinator

Spawn the quality-coordinator agent to orchestrate the analysis:

```
Use Task tool with subagent_type="quality-coordinator"

The coordinator will:
- Analyze repository structure
- Spawn specialist agents in parallel
- Collect and aggregate findings
- Calculate weighted score
- Determine grade (A-F)
- Call MCP quality save to persist results
```

### Step 4: Present Results

Display the analysis summary to the user:

```markdown
## Quality Analysis Results

**Score:** 85/100
**Grade:** B

### Category Breakdown
| Category | Issues | Impact |
|----------|--------|--------|
| Security | 1 | -10.5 |
| Performance | 2 | -4.0 |
| Testing | 0 | 0 |
...

### Top Issues
1. [Security] Hardcoded API key in src/config.ts:42
2. [Performance] N+1 query in src/api/users.ts:78
...

### Recommendations
1. Move API keys to environment variables
2. Add eager loading for user queries
...
```

### Step 5: Offer Follow-up Actions

After presenting results, offer:
- View full report: `quality details runId=<id>`
- View history: `quality history`
- Compare runs: Show score trend
- Fix issues: Offer to address specific issues

## Commands

### Run Analysis
```
/quality
```
Runs full quality analysis and saves results.

### View History
```
mcp__tiny-brain__quality({
  operation: "history",
  limit: 10
})
```
Lists previous quality runs with summary.

### View Run Details
```
mcp__tiny-brain__quality({
  operation: "details",
  runId: "2025-01-03-quality"
})
```
Shows full details for a specific run.

## Quality Categories

| Category | Weight | Agent |
|----------|--------|-------|
| Security | 15 | security-reviewer |
| Reliability | 10 | performance-engineer |
| Performance | 10 | performance-engineer |
| Maintainability | 5 | reviewer |
| Testing | 5 | tdd-validator |
| Architecture | 5 | architect |
| Documentation | 3 | reviewer |
| Operations | 3 | architect |

## Grading Scale

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90-100 | Excellent - production ready |
| B | 80-89 | Good - minor improvements |
| C | 70-79 | Acceptable - needs attention |
| D | 60-69 | Below standard - significant work |
| F | <60 | Failing - major issues |

## Templates

- `templates/quality_criteria.md` - Category standards and weights
- `templates/quality_process.md` - 5-phase analysis methodology
- `templates/template.md` - Run output format

## Persistence

Results are saved to:
- `docs/quality/runs/YYYY-MM-DD-quality.md`

Includes:
- YAML frontmatter for indexing
- Full issue details
- Recommendations
- Raw JSON data for programmatic access

## Example

```
User: "Run a quality check on this repo"

Claude:
1. Read quality_criteria.md for standards
2. Read quality_process.md for methodology
3. Spawn quality-coordinator agent
4. Wait for analysis to complete
5. Present summary:
   "Your repository scored 78/100 (Grade: C)

    Top Issues:
    - 2 security issues (hardcoded secrets)
    - 3 performance issues (N+1 queries)
    - Missing test coverage for auth module

    Would you like me to address any of these?"
```

## Customization

To customize quality standards for your project:

1. Copy templates to docs/quality/:
   ```bash
   mkdir -p docs/quality
   cp templates/quality_criteria.md docs/quality/
   ```

2. Modify weights and standards as needed

3. The skill will use project-specific standards when present
