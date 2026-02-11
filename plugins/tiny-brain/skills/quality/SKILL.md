---
name: quality
version: 3.0.0
description: Run comprehensive code quality analysis on the repository. Performs weighted scoring across 8 categories using automated analyzers and 4 specialist investigation agents.
allowed-tools: Read, Write, Bash, Glob, Grep, Task, TaskOutput, mcp__plugin_tiny-brain_mcp__quality
---

# Quality Analysis Skill

## Architecture

Three-layer specialist model keeps the main conversation under ~10-15K tokens:

```
Main Conversation (thin orchestrator)
  |
  |-- Layer 1: MCP run-analyzers -> writes analysis.json (zero context cost)
  |-- Layer 2: 4 specialist Task agents (background) -> write domain.json files
  |-- Layer 3: MCP assemble-run -> reads all files, merges, scores, saves report
```

### Specialist Agent Mapping

| Agent (subagent_type) | Model | Categories | Checklists |
|---|---|---|---|
| `tiny-brain:security-quality-reviewer` | opus | Security | SEC-* (7 checks) |
| `tiny-brain:performance-quality-reviewer` | sonnet | Performance, Reliability | PERF-* (5), REL-* (6) = 11 checks |
| `tiny-brain:testing-quality-reviewer` | sonnet | Testing | TEST-* (4 checks) |
| `tiny-brain:code-quality-reviewer` | sonnet | Maintainability, Architecture, Documentation, Operations | MAINT-* (6), ARCH-* (5), DOC-* (4), OPS-* (4) = 19 checks |

42 checks across 4 specialists covering all 8 categories.

## When to Use

Run a quality analysis when the user wants to:
- Assess overall code quality before a release
- Identify technical debt and improvement areas
- Track quality trends over time
- Prepare for a code review or audit
- Establish a quality baseline for a new project

## Workflow

### Phase 1: Discovery

Run discovery directly in the main conversation:

1. Read `templates/agent_findings.md` to understand the output schema agents must follow
2. Call `mcp quality detect-analyzers` to find available CLI analyzers
3. Use Bash `find` to list eligible source files (the Glob tool cannot exclude directories):
   ```bash
   find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.rb" -o -name "*.go" -o -name "*.rs" -o -name "*.java" \) \
     -not -path "*/node_modules/*" \
     -not -path "*/dist/*" \
     -not -path "*/build/*" \
     -not -path "*/coverage/*" \
     -not -path "*/.next/*" \
     -not -path "*/.tiny-brain/*" \
     | sort
   ```
4. Separate test files (matching `*.{test,spec}.{ts,tsx,js,jsx}` or `__tests__/` in the path) from source files
5. Read `.tiny-brain/analysis.json` for tech context (languages, frameworks)
6. Generate runId: `YYYY-MM-DDTHH-mm` format (e.g., `2026-02-10T18-03`)
7. Create run directory: `docs/quality/runs/YYYY-MM-DD/HH-mm/`
8. Write `{runDir}/files.txt` using `&&` chaining (zsh does not support `{ }` command groups):
   ```bash
   find . -type f ... | grep -v test_pattern > {runDir}/files.txt && echo "---TESTS---" >> {runDir}/files.txt && find . -type f ... | grep test_pattern >> {runDir}/files.txt
   ```
9. Write `{runDir}/metadata.json` with the current commit SHA (anchor for future incremental runs):
   ```bash
   echo '{"commitSha":"'$(git rev-parse HEAD)'","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'","baseRunId":null,"filesAnalyzed":'${N}',"totalFiles":'${TOTAL}'}' > {runDir}/metadata.json
   ```

**Report to user:**
```
Analyzing repository...
  Found {N} source files, {M} test files
  Detected {K} analyzers: ESLint, TypeScript, npm audit
  Run directory: docs/quality/runs/YYYY-MM-DD/HH-mm/
```

### Phase 1.5: Incremental Detection (optional)

After discovery and before launching specialists, check if an incremental run is possible:

1. Call `mcp quality history limit=1` to check for a previous run
2. If a base run exists:
   a. Read `{baseRunDir}/metadata.json` for the base commit SHA
   b. If `metadata.json` is missing, fall back to full analysis (skip to Phase 2)
   c. Run `git diff --name-only {baseSha} HEAD` to get changed files
   d. Filter the file list to only changed files (intersection with discovered source files)
   e. If no files changed, skip analysis entirely and report "No changes since last run"
   f. Rewrite `{runDir}/files.txt` with only changed files (keep same format with `---TESTS---` separator)
   g. Write `{runDir}/metadata.json` with current commit SHA and `baseRunId` set to the base run ID
   h. Store `baseRunId` for use in Phase 4 assembly
3. If no base run exists, proceed with full analysis (current behavior)

**Report to user (incremental):**
```
Incremental analysis (base: {baseRunId})
  {X} files changed since last run
  Analyzing changed files only, carrying forward {Y} unchanged file results
```

### Phase 2: Parallel Launch

Launch ALL operations in a **single message** - MCP + 4 Task agents:

**Layer 1: MCP run-analyzers** (writes to file, returns summary only):
```
mcp quality run-analyzers outputPath={runDir}/analysis.json
```

**Layer 2: 4 specialist Task agents** (all `run_in_background: true`):

Each Task prompt is minimal (~10 lines). The specialist agents have their checklists built in.

```
Task tool:
  subagent_type: "tiny-brain:security-quality-reviewer"
  model: "opus"
  run_in_background: true
  prompt: |
    Analyze repository for security quality issues.
    Repository path: {repo_path}
    Read file list from: {runDir}/files.txt (source files only, above ---TESTS--- line)
    Write findings JSON to: {runDir}/security-quality-reviewer-output.json
    Follow the agent_findings schema from templates/agent_findings.md.
    Set source: "llm" and ruleId: "SEC-*" check IDs on all issues.
```

```
Task tool:
  subagent_type: "tiny-brain:performance-quality-reviewer"
  model: "sonnet"
  run_in_background: true
  prompt: |
    Analyze repository for performance and reliability quality issues.
    Repository path: {repo_path}
    Read file list from: {runDir}/files.txt (source files only, above ---TESTS--- line)
    Write findings JSON to: {runDir}/performance-quality-reviewer-output.json
    Follow the agent_findings schema from templates/agent_findings.md.
    Set source: "llm" and ruleId: "PERF-*" or "REL-*" check IDs on all issues.
```

```
Task tool:
  subagent_type: "tiny-brain:testing-quality-reviewer"
  model: "sonnet"
  run_in_background: true
  prompt: |
    Analyze repository for testing quality issues.
    Repository path: {repo_path}
    Read file list from: {runDir}/files.txt (ALL files - both source and test files)
    Write findings JSON to: {runDir}/testing-quality-reviewer-output.json
    Follow the agent_findings schema from templates/agent_findings.md.
    Set source: "llm" and ruleId: "TEST-*" check IDs on all issues.
```

```
Task tool:
  subagent_type: "tiny-brain:code-quality-reviewer"
  model: "sonnet"
  run_in_background: true
  prompt: |
    Analyze repository for maintainability, architecture, documentation, and operations quality issues.
    Repository path: {repo_path}
    Read file list from: {runDir}/files.txt (source files only, above ---TESTS--- line)
    Write findings JSON to: {runDir}/code-quality-reviewer-output.json
    Follow the agent_findings schema from templates/agent_findings.md.
    Set source: "llm" and ruleId: "MAINT-*", "ARCH-*", "DOC-*", or "OPS-*" check IDs on all issues.
```

**Report to user:**
```
Launching specialist investigations...
  Security Review: analyzing {N} files...
  Performance & Reliability: analyzing {N} files...
  Testing Review: analyzing {M} test + {N} source files...
  Code Review: analyzing {N} files...
```

### Phase 3: Monitor & Report Progress

Use **TaskOutput** to check background agent completion (NOT Read on JSON files):

1. When the MCP run-analyzers returns: report analyzer summary
2. For each specialist agent: use `TaskOutput` with the agent's task_id to check completion. The agent's final message includes summary counts - no need to read full JSON files.

**Report to user progressively:**
```
Running analyzers...
  ESLint: {N} issues
  TypeScript: {N} errors
  npm audit: {N} vulnerabilities

  Testing Review: complete ({N} issues)
  Security Review: complete ({N} issues)
  Performance & Reliability: complete ({N} issues)
  Code Review: complete ({N} issues)

All investigations complete. Assembling report...
```

### Phase 4: Assemble

Call `mcp quality assemble-run` with the runId. If this is an incremental run (Phase 1.5 detected changes), also pass `baseRunId`:

**Full run:**
```
mcp quality assemble-run runId=YYYY-MM-DDTHH-mm
```

**Incremental run:**
```
mcp quality assemble-run runId=YYYY-MM-DDTHH-mm baseRunId=YYYY-MM-DDTHH-mm
```

When `baseRunId` is provided, assembly carries forward issues from unchanged files and replaces issues only for re-analyzed files. This produces a complete score equivalent to a full run.

**Report to user:**
```
  {A} analyzer + {B} specialist -> {C} unique issues ({D} duplicates removed)
```

### Phase 5: Present Results

Display the analysis summary. For incremental runs, include the analysis type:

```markdown
## Quality Analysis Results

**Score:** {score}/100
**Grade:** {grade}

<!-- For incremental runs only: -->
**Analysis type:** Incremental (based on run {baseRunId})
**Files analyzed:** {N} changed / {M} total
**Files carried forward:** {K}

### Source Breakdown
| Source | Issues | Percentage |
|--------|--------|------------|
| Analyzers | {N} | {P}% |
| Specialist Investigation | {N} | {P}% |

### Category Breakdown
| Category | Issues | Grade |
|----------|--------|-------|
| Security | {N} | {grade} |
| Reliability | {N} | {grade} |
| Performance | {N} | {grade} |
| Maintainability | {N} | {grade} |
| Testing | {N} | {grade} |
| Architecture | {N} | {grade} |
| Documentation | {N} | {grade} |
| Operations | {N} | {grade} |

### Top Issues
1. [{category}/{severity}] {message} in {file}:{line}
   Evidence: `{code}`
   Effort: {effort} ({hours}h) | Theme: {theme}
2. ...
```

### Phase 6: Offer Follow-ups

After presenting results, offer:
- View full report: `quality details runId=<id>`
- View history: `quality history`
- Generate improvement plan: `/quality plan`
- Compare with previous run: `/quality compare baseRunId=<old> targetRunId=<new>`

## Commands

### Run Analysis
```
/quality
```
Runs full quality analysis and saves results.

### View History
```
mcp__plugin_tiny-brain_mcp__quality({
  operation: "history",
  limit: 10
})
```
Lists previous quality runs with summary.

### View Run Details
```
mcp__plugin_tiny-brain_mcp__quality({
  operation: "details",
  runId: "2026-02-10T18-03"
})
```
Shows full details for a specific run.

### Generate Quality Improvement Plan
```
/quality plan
```
Generates a Quality Improvement Plan (QIP) from the latest quality run.

### Compare Quality Runs
```
/quality compare baseRunId=2026-01-01T10-00 targetRunId=2026-01-15T14-30
```
Compares two quality runs to show improvement or regression.

## Quality Categories

| Category | Weight |
|----------|--------|
| Security | 15 |
| Reliability | 10 |
| Performance | 10 |
| Maintainability | 5 |
| Testing | 5 |
| Architecture | 5 |
| Documentation | 3 |
| Operations | 3 |

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
- `templates/quality_process.md` - Three-layer specialist architecture documentation
- `templates/agent_findings.md` - Standard JSON schema for agent output
- `templates/template.md` - Run output format

## Persistence

Run directory: `docs/quality/runs/YYYY-MM-DD/HH-mm/`

Intermediate files (in run directory):
- `analysers/` - Raw per-analyzer output files (e.g., `eslint-0.json`, `typescript-0.txt`)
- `analysis.json` - Merged/normalized analyzer issues (from MCP run-analyzers)
- `security-quality-reviewer-output.json` - Security specialist findings
- `performance-quality-reviewer-output.json` - Performance & Reliability findings
- `testing-quality-reviewer-output.json` - Testing specialist findings
- `code-quality-reviewer-output.json` - Code Review specialist findings
- `files.txt` - File list used by agents
- `metadata.json` - Run metadata (commitSha, baseRunId, file counts) for incremental runs

Final report:
- `quality.md` - Final merged report (from MCP assemble-run)

## Example

```
User: "Run a quality check on this repo"

Claude:
1. Read templates/agent_findings.md for output schema
2. Discovery:
   - "Found 87 source files, 34 test files"
   - "Detected 3 analyzers: ESLint, TypeScript, npm audit"
   - Generate runId: 2026-02-10T14-30
   - Create directory: docs/quality/runs/2026-02-10/14-30/
   - Write files.txt to run directory
3. Launch ALL in a single message (1 MCP + 4 Task agents):
   - MCP: run-analyzers outputPath=docs/quality/runs/2026-02-10/14-30/analysis.json
   - Task: security-reviewer (read files.txt, write security.json)
   - Task: performance-engineer (read files.txt, write performance-reliability.json)
   - Task: tdd-validator (read files.txt, write testing.json)
   - Task: reviewer (read files.txt, write review.json)
4. Report progress via TaskOutput as each completes:
   - "ESLint: 12 issues, TypeScript: 0 errors, npm audit: 2 vulnerabilities"
   - "Testing Review: complete (3 issues)"
   - "Security Review: complete (5 issues)"
   - "Performance & Reliability: complete (2 issues)"
   - "Code Review: complete (8 issues)"
5. "All investigations complete. Assembling report..."
6. MCP: assemble-run runId=2026-02-10T14-30
   - "14 analyzer + 18 specialist -> 28 unique (4 duplicates removed)"
7. Present full summary to user
8. Offer follow-up actions
```
