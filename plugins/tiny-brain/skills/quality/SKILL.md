---
name: quality
version: 3.0.0
description: Run comprehensive code quality analysis on the repository using analyzer and agent steps from the qualityPipeline config.
allowed-tools: Read, Write, Bash, Glob, Grep, Task, TaskOutput, mcp__plugin_tiny-brain_mcp__quality
---

# Quality Analysis Skill

## Architecture

Two-layer model driven by `qualityPipeline` config:

```
Main Conversation (thin orchestrator)
  |
  |-- Analyzer steps (step.analyzer set): CLI `run-analyser` commands
  |-- Agent steps (no step.analyzer): LLM Task agents (background)
  |-- Assembly: MCP assemble-run -> reads all files, merges, saves report
```

### Step Partitioning

The `qualityPipeline` config contains ALL steps. Each step has a `type`, `agent`, and optionally an `analyzer` field:

- **Analyzer steps** (`step.analyzer` is set): Run via `tiny-brain _run-analyser <id> --quality`. No LLM agent spawned.
- **Agent steps** (no `step.analyzer`): Spawn as LLM Task agents.

Do NOT use `mcp quality detect-analysers` or `mcp quality run-analysers`. Do NOT hardcode any step names. The pipeline config is the single source of truth.

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

1. Read `packages/tiny-brain-plugin/skills/quality/templates/quality_report.md` — you will paste its full content into every agent prompt (Phase 2)
2. Run `tiny-brain config preferences get qualityPipeline` to get the configured quality pipeline steps. The output is a JSON array of step objects:
   ```json
   [
     {"type":"coverage","agent":"tiny-brain:analyzer-agent","analyzer":"coverage",...},
     {"type":"security","agent":"tiny-brain:security-reviewer",...},
     ...
   ]
   ```
   Parse this array and partition into two lists:
   - **Analyzer steps**: entries where `analyzer` field is present (these have `"agent":"tiny-brain:analyzer-agent"` — ignore the agent field, use the CLI instead)
   - **Agent steps**: entries where `analyzer` field is NOT present (use the `agent` field to spawn the Task agent, use the `type` field as the step type for persist)

   If the config is empty or not set, warn the user: "No qualityPipeline configured. Run `tiny-brain analyse` to detect and configure quality steps." and stop.
3. Use Bash `find` to list eligible source files (the Glob tool cannot exclude directories):
   ```bash
   find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.rb" -o -name "*.go" -o -name "*.rs" -o -name "*.java" \) \
     -not -path "*/node_modules/*" \
     -not -path "*/dist/*" \
     -not -path "*/build/*" \
     -not -path "*/coverage/*" \
     -not -path "*/.next/*" \
     -not -path "*/.tiny-brain/*" \
     -not -path "*/.claude/*" \
     -not -path "*/.stryker-tmp/*" \
     -not -path "*/docs/*" \
     | sort
   ```
4. Separate test files (matching `*.{test,spec}.{ts,tsx,js,jsx}` or `__tests__/` in the path) from source files
5. Read `.tiny-brain/analysis.json` for tech context (languages, frameworks)
6. Generate runId: `YYYY-MM-DDTHH-mm` format (e.g., `2026-02-10T18-03`)
7. Create run directory: `.tiny-brain/quality/runs/YYYY-MM-DD/HH-mm/`
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
  Pipeline: {K} analyzer steps, {J} agent steps
  Run directory: .tiny-brain/quality/runs/YYYY-MM-DD/HH-mm/
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

Launch ALL operations in a **single message** — analyzers via CLI, agents via Task tool.

You already have the partitioned steps from Phase 1 step 2.

**Analyzer steps** — run each via Bash (all in the same message, parallel):

For each analyzer step, run:
```bash
tiny-brain _run-analyser {step.type} --quality
```

This reads the analyzer invocation from `analysis.json`, runs it, and persists the result to `{runDir}/analysers/{step.type}.json`. No LLM agent needed.

**Agent steps** — launch each as a background Task agent (all in the same message, parallel):

**Replace `{quality_report_template_content}` with the full text of `quality_report.md` that you read in Phase 1 step 1:**

```
Task tool:
  subagent_type: "{step.agent}"
  run_in_background: true
  prompt: |
    Analyze repository for quality issues.
    Repository path: {repo_path}
    Read file list from: {runDir}/files.txt

    MANDATORY OUTPUT SCHEMA — your persist JSON MUST follow this exactly:

    {quality_report_template_content}

    Persist using:
      tiny-brain _review persist {step.type} --quality --json '<your-json>'
    The --quality flag routes output to the active quality run directory.
    Do NOT use --sha or write to .tiny-brain/reviews/ — that is for the commit pipeline.
```

**If a previous run exists** (Phase 1.5 found a `baseRunId`), append this context to each agent's prompt:

```
    Previous run findings: {baseRunDir}/agents/{step.type}.json
    If the file does not exist or cannot be parsed, skip comparison and treat all findings as new.
    Otherwise, compare your findings against the previous run:
    - Tag current findings with previousRunStatus: "new" (not in previous run) or "unchanged" (same issue persists)
    - For resolved issues (in previous run but no longer found), add a summary in your metadata, not as findings
```

For any agent step whose `type` contains "testing", include "(ALL files - both source and test files)" in the prompt so it reads test files too.

**IMPORTANT:** Do NOT launch agents for analyzer steps. Steps with `step.analyzer` set are handled entirely by the CLI command above.

**Report to user:**
```
Launching quality analysis...
  Analyzers: running {K} static analyzers via CLI
  Agents: spawning {J} specialist reviewers
```

### Phase 3: Monitor & Report Progress

1. Analyzer CLI commands return immediately with output path — report each as it completes
2. For each specialist agent: use `TaskOutput` with the agent's task_id to check completion

**Report to user progressively:**
```
Static analyzers:
  ESLint: complete
  TypeScript: complete
  Coverage: complete
  Dependency Audit: complete

Specialist agents:
  {agent-1}: complete ({N} issues)
  {agent-2}: complete ({N} issues)
  ...

All investigations complete. Assembling report...
```

### Phase 3.5: Verify Agent Outputs

After all agents complete, verify their output files exist before assembly:

1. List files in `{runDir}/agents/` using Bash `ls`
2. For each expected agent step, check that `{step.type}.json` exists
3. Log warnings for any missing agent outputs:
   ```
   Verifying agent outputs...
     {step-type}.json ✓
     {step-type}.json ✗ MISSING
   ```
4. If ALL agent outputs are missing, warn the user:
   ```
   ⚠️ No agent output files found in {runDir}/agents/
   Agents may have written to the wrong location. Check .tiny-brain/reviews/ for stray outputs.
   ```
5. Proceed with assembly even if some are missing (analyzers still produce data)

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
- Implement improvement plan: `/quality implement`

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

After presenting the plan summary, ask the user: "Would you like to implement this plan? This will create fix documents for each initiative."

If the user confirms, invoke:
```
mcp__plugin_tiny-brain_mcp__quality({ operation: "implement-plan", planId: "<planId>" })
```
After implementation, list the created fix documents and suggest starting with Phase 1 fixes.

### Implement Quality Improvement Plan
```
/quality implement
/quality implement planId=2026-02-09T14-30-plan
```
Creates fix documents from a saved Quality Improvement Plan. Each initiative in the plan becomes a fix document in `.tiny-brain/fixes/` with pattern-deduplicated tasks.

If no `planId` is provided, use the most recent plan from `mcp quality history`.

MCP equivalent:
```
mcp__plugin_tiny-brain_mcp__quality({ operation: "implement-plan", planId: "2026-02-09T14-30-plan" })
```

After creating fixes, run `tiny-brain task sync .tiny-brain/fixes/<fixId>.md` for each to update progress tracking.

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
- `templates/quality_process.md` - Analyzer/agent architecture documentation
- `templates/quality_report.md` - Standard JSON schema for agent output
- `templates/template.md` - Run output format

## Persistence

Run directory: `.tiny-brain/quality/runs/YYYY-MM-DD/HH-mm/`

Intermediate files (in run directory):
- `analysers/` - Raw per-analyzer output files (e.g., `{analyser-id}.json`)
- `analysis.json` - Merged/normalized analyzer issues (from CLI run-analyser commands)
- `agents/` - Capability agent findings (one per discovered capability):
  - `{step-type}.json` - one file per agent step
- `files.txt` - File list used by agents
- `metadata.json` - Run metadata (commitSha, baseRunId, file counts) for incremental runs

Final report:
- `quality.md` - Final merged report (from MCP assemble-run)

## Example

```
User: "Run a quality check on this repo"

Claude:
1. Read templates/quality_report.md for output schema
2. Discovery:
   - Run: tiny-brain config preferences get qualityPipeline
   - Partition steps by step.analyzer field into analyzer steps and agent steps
   - "Found 87 source files, 34 test files"
   - Generate runId, create run directory, write files.txt
3. Launch ALL in a single message:
   - For each analyzer step: Bash: tiny-brain _run-analyser {step.type} --quality
   - For each agent step: Task: {step.agent} (background)
4. Report progress as each completes:
   - "{analyzer}: complete"
   - "{agent}: complete ({N} issues)"
5. "All investigations complete. Assembling report..."
6. MCP: assemble-run runId=...
7. Present full summary to user
8. Offer follow-up actions

User: "/quality implement"
Claude:
1. MCP: quality implement-plan planId=2026-02-10T14-30-plan
2. "Created 5 fix documents from plan"
3. Run sync-file for each fix to update progress tracking
4. Suggest starting with Phase 1 fixes
```
