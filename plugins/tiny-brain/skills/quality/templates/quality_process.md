# Quality Analysis Process

This document describes the 5-phase methodology for conducting comprehensive code quality analysis.

## Overview

The quality-coordinator agent orchestrates analysis by spawning specialist agents in parallel, collecting their findings, and aggregating results into a final score and grade.

## Phase 1: Discovery

**Purpose**: Understand the repository structure and technology stack.

**Actions**:
1. Read repository configuration (package.json, tsconfig.json, etc.)
2. Identify primary languages and frameworks
3. Detect testing frameworks and coverage tools
4. Map directory structure
5. Note any existing quality configuration

**Output**: Repository context object with:
- Languages detected
- Frameworks in use
- Build tools
- Test configuration
- Project type (library, application, monorepo)

## Phase 2: Parallel Analysis

**Purpose**: Conduct specialized analysis across all quality categories simultaneously.

**Agent Assignments**:

| Agent | Categories | Focus Areas |
|-------|------------|-------------|
| security-reviewer | Security | Vulnerabilities, auth, secrets |
| performance-engineer | Performance, Reliability | Speed, stability, error handling |
| tdd-validator | Testing | Coverage, test quality |
| reviewer | Maintainability, Documentation | Code quality, docs |
| architect | Architecture, Operations | Design, deployability |

**Process**:
1. Spawn all specialist agents in parallel via Task tool
2. Each agent analyzes their assigned categories
3. Agents return structured findings:
   ```json
   {
     "category": "Security",
     "issues": [
       {
         "severity": "major",
         "file": "src/api.ts",
         "line": 42,
         "message": "Hardcoded API key",
         "suggestion": "Use environment variable"
       }
     ],
     "observations": ["Uses helmet for headers"],
     "score_impact": -10.5
   }
   ```

## Phase 3: Aggregation

**Purpose**: Combine findings from all agents into a unified view.

**Process**:
1. Collect responses from all specialist agents
2. Deduplicate overlapping issues
3. Validate issue severity against criteria
4. Group issues by category
5. Calculate category-level scores

**Deduplication Rules**:
- Same file + line + message = single issue
- Take highest severity when duplicated
- Merge suggestions from different agents

## Phase 4: Scoring

**Purpose**: Calculate final score and grade.

**Algorithm**:
```
score = 100
for each issue:
    weight = CATEGORY_WEIGHTS[issue.category]
    multiplier = SEVERITY_MULTIPLIERS[issue.severity]
    deduction = weight * multiplier
    score -= deduction
score = max(0, score)  # Floor at 0
```

**Grade Thresholds**:
| Grade | Score Range | Description |
|-------|-------------|-------------|
| A | 90-100 | Excellent quality |
| B | 80-89 | Good with minor issues |
| C | 70-79 | Acceptable, needs work |
| D | 60-69 | Below standard |
| F | <60 | Significant issues |

## Phase 5: Reporting

**Purpose**: Generate actionable output and persist results.

**Actions**:
1. Generate markdown report from template
2. Prioritize recommendations by impact
3. Call MCP `quality save` to persist:
   - Score and grade
   - All issues with details
   - Recommendations
   - Repository context
4. Display summary to user

**Report Structure**:
1. Executive summary (score, grade, issue count)
2. Category breakdown
3. Top issues (critical/major first)
4. Actionable recommendations
5. Comparison to previous run (if available)

## Error Handling

**Agent Timeout**:
- Default timeout: 60 seconds per agent
- On timeout: Score category as 0 (worst case)
- Log warning about incomplete analysis

**Agent Failure**:
- Catch errors from individual agents
- Continue with remaining agents
- Note failed categories in report
- Suggest manual review for failed categories

**No Issues Found**:
- Valid result (perfect score possible)
- Still persist run for tracking
- Note in report that no issues detected

## Customization

The analysis process can be customized by:
1. Modifying `quality_criteria.md` weights
2. Adding project-specific standards
3. Excluding certain files/directories
4. Adjusting severity thresholds

Configuration is read from `docs/quality/quality_criteria.md` if present, otherwise defaults from the skill template are used.
