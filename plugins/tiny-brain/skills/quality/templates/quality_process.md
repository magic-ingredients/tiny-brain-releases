# Quality Analysis Process

This document describes the three-layer specialist architecture for conducting comprehensive code quality analysis.

## Overview

The quality skill uses a **thin orchestrator** in the main conversation that delegates heavy work to three layers:

```
Main Conversation (thin orchestrator, ~10-15K tokens)
  |
  |-- Layer 1: MCP run-analysers -> writes analysis.json (zero context cost)
  |-- Layer 2: 4 specialist Task agents (background) -> write domain.json files
  |-- Layer 3: MCP assemble-run -> reads all files, merges, scores, saves report
```

This ensures:

1. **No context overflow** - all heavy data goes to disk, never through conversation context
2. **Domain expertise** - each specialist agent has focused domain knowledge and checklists
3. **Full coverage** - 42 checks across 8 categories via 4 specialists
4. **Visible progress** - the user sees each analyzer and specialist complete
5. **Auditability** - all intermediate files are preserved in nested run directories

## Specialist Agent Mapping

| Agent (subagent_type) | Model | Categories | Checklists | File Types |
|---|---|---|---|---|
| `tiny-brain:security-reviewer` | opus | Security | SEC-* (7) | Source files |
| `tiny-brain:performance-engineer` | sonnet | Performance, Reliability | PERF-* (5), REL-* (6) | Source files |
| `tiny-brain:tdd-validator` | sonnet | Testing | TEST-* (4) | Test + source files |
| `tiny-brain:reviewer` | sonnet | Maint, Arch, Doc, Ops | MAINT-* (6), ARCH-* (5), DOC-* (4), OPS-* (4) | Source files |

## Run Directory Structure

Each quality run gets a nested directory based on timestamp:

**RunId format:** `YYYY-MM-DDTHH-mm` (e.g., `2026-02-10T18-03`)
**Disk path:** `.tiny-brain/quality/runs/YYYY-MM-DD/HH-mm/`

Files within a run directory:
| File | Source | Content |
|------|--------|---------|
| `files.txt` | Phase 1 (Discovery) | File list for agents (source + test files) |
| `metadata.json` | Phase 1 (Discovery) | Run metadata (commitSha, baseRunId, file counts) |
| `analysers/` | MCP run-analysers | Raw per-analyzer output files (e.g., `eslint-0.json`, `typescript-0.txt`) |
| `analysis.json` | MCP run-analysers | Merged/normalized analyzer issues |
| `agents/` | Specialist agents | Agent findings subdirectory |
| `agents/security-quality-reviewer.json` | security-quality-reviewer agent | Security findings |
| `agents/performance-quality-reviewer.json` | performance-quality-reviewer agent | Performance & Reliability findings |
| `agents/testing-quality-reviewer.json` | testing-quality-reviewer agent | Testing findings |
| `agents/code-quality-reviewer.json` | code-quality-reviewer agent | Code Review findings |
| `quality.md` | MCP assemble-run | Final merged report |

Legacy runs (pre-v3) use flat `.tiny-brain/quality/runs/YYYY-MM-DD-*.json` naming.

## Phase 1: Discovery

**Purpose**: Detect available analyzers, list eligible files, and prepare the run directory.

**Executed by**: Skill (main conversation)

**Actions**:
1. Read `templates/agent_findings.md` for the output schema
2. Call `mcp quality detect-analysers` to find configured CLI analyzers
3. Glob for eligible source files (excluding `node_modules`, `dist`, etc.)
4. Separate test files from source files
5. Read `.tiny-brain/analysis.json` for detected tech stack
6. Generate runId and create nested run directory
7. Write `files.txt` to run directory (source files, then `---TESTS---` separator, then test files)

**User output**:
```
Analyzing repository...
  Found 87 source files, 34 test files
  Detected 3 analyzers: ESLint, TypeScript, npm audit
  Run directory: .tiny-brain/quality/runs/2026-02-10/18-03/
```

## Phase 2: Parallel Launch

**Purpose**: Launch ALL operations simultaneously in a single message.

**Executed by**: Skill (main conversation)

**Operations launched**:
1. **MCP run-analysers** with `runId={runId}` (writes to file, returns summary only)
2. **4 specialist Task agents** with `run_in_background: true` - each reads `files.txt` from the run directory

Task prompts are minimal (~10 lines each). Specialist agents have their domain checklists built into their agent definitions - no need to embed checklists in the prompt.

**User output**:
```
Launching specialist investigations...
  Security Review: analyzing 87 files...
  Performance & Reliability: analyzing 87 files...
  Testing Review: analyzing 34 test + 87 source files...
  Code Review: analyzing 87 files...
```

## Phase 3: Monitor & Report Progress

**Purpose**: Track completion and report progress to user.

**Executed by**: Skill (main conversation)

**Actions**:
1. When MCP run-analysers returns, report analyzer summary
2. Use **TaskOutput** with each agent's task_id to check completion - agents' final messages include summary counts, so no need to Read full JSON files
3. When ALL complete, announce assembly

**User output**:
```
Running analyzers...
  ESLint: 12 issues
  TypeScript: 0 errors
  npm audit: 2 vulnerabilities

  Testing Review: complete (3 issues)
  Security Review: complete (5 issues)
  Performance & Reliability: complete (2 issues)
  Code Review: complete (8 issues)

All investigations complete. Assembling report...
```

## Phase 4: Assemble

**Purpose**: Read all intermediate files, merge, score, and save the final report.

**Executed by**: MCP assemble-run (server-side, zero context cost)

**Actions**:
1. Read all `*.json` files from `runs/{date}/{time}/` directory
2. Separate analyzer findings from specialist (LLM) findings
3. Merge analyzer + specialist issues using fingerprint deduplication
4. Calculate score and grade
5. Save final quality report as `quality.md` in the run directory

**User output**:
```
  14 analyzer + 18 specialist -> 28 unique (4 duplicates removed)
```

## Phase 5: Present Results

**Purpose**: Display actionable results to the user.

**Executed by**: Skill (main conversation)

**Report structure**:
1. Executive summary (score, grade, issue count)
2. Source breakdown (analyzers vs specialist investigation)
3. Category breakdown with per-category grades
4. Top issues (critical/major first) with evidence and effort estimates
5. Technical debt summary
6. Recommendations

## Phase 6: Offer Follow-ups

**Purpose**: Provide next steps for the user.

- View full report: `quality details runId=<id>`
- View history: `quality history`
- Generate improvement plan: `/quality plan`
- Compare with previous run: `/quality compare`

## Progress Reporting Format

Progress is reported to the user at BOTH layers:

### Analyzer Stage
Each analyzer completion is reported with its issue count. Since `run-analysers` writes directly to disk, only the summary text flows through conversation context.

### Specialist Agent Stage
Each specialist agent completion is checked via **TaskOutput**. The agent's final message includes summary counts. No JSON files are read into the main context.

## Error Handling

**Agent Timeout**:
- Log warning about incomplete analysis
- Use whatever results are available from completed agents
- Note in report: "Analysis incomplete for {domain}"

**Agent Failure**:
- Check if the output file was partially written
- Continue with results from other specialists
- Note failed domains in recommendations

**Analyzer Failure**:
- MCP run-analysers handles individual analyzer failures internally
- Summary still returned for successful analyzers

**No Issues Found**:
- Valid result (perfect score possible)
- Still persist run for tracking
