# Quality Improvement Plan - {date}

## Executive Summary

{executiveSummary}

## Current State vs Target

| Metric | Current | Target |
|--------|---------|--------|
| Score | {currentScore}/100 | {targetScore}/100 |
| Grade | {currentGrade} | {targetGrade} |
| Total Effort | - | {totalEffortHours} hours |

## Phase Breakdown

### Phase 1: Quick Wins

High-ROI, low-effort improvements that deliver the fastest score gains.

**Projected Score:** {phase1ProjectedScore}/100 (Grade {phase1ProjectedGrade})
**Total Effort:** {phase1TotalEffortHours} hours
**Estimated Duration:** {phase1EstimatedDuration}

| Initiative | Category | Effort (hrs) | Score Gain |
|------------|----------|-------------|------------|
| {initiative.title} | {initiative.primaryCategory} | {initiative.effortHours} | +{initiative.expectedScoreGain} |

### Phase 2: Core Improvements

Medium-effort improvements that address core quality gaps.

**Projected Score:** {phase2ProjectedScore}/100 (Grade {phase2ProjectedGrade})
**Total Effort:** {phase2TotalEffortHours} hours
**Estimated Duration:** {phase2EstimatedDuration}

| Initiative | Category | Effort (hrs) | Score Gain |
|------------|----------|-------------|------------|
| {initiative.title} | {initiative.primaryCategory} | {initiative.effortHours} | +{initiative.expectedScoreGain} |

### Phase 3: Structural Work

High-effort structural changes and architectural improvements.

**Projected Score:** {phase3ProjectedScore}/100 (Grade {phase3ProjectedGrade})
**Total Effort:** {phase3TotalEffortHours} hours
**Estimated Duration:** {phase3EstimatedDuration}

| Initiative | Category | Effort (hrs) | Score Gain |
|------------|----------|-------------|------------|
| {initiative.title} | {initiative.primaryCategory} | {initiative.effortHours} | +{initiative.expectedScoreGain} |

## Per-Initiative Details

### {initiative.title}

**ID:** {initiative.id}
**Theme:** {initiative.theme}
**Category:** {initiative.primaryCategory}
**Effort:** {initiative.effortHours} hours
**Expected Score Gain:** +{initiative.expectedScoreGain}

{initiative.description}

**Issues Addressed:**
- Issue #{issueIndex}: {issue.message} ({issue.file})

**Dependencies:** {initiative.dependsOn}
**Risk Level:** {initiative.risk}

## ROI Analysis

**Estimated Cost to Fix:** {roiAnalysis.currency} {roiAnalysis.estimatedCostToFix}
**Hourly Rate:** {roiAnalysis.currency} {roiAnalysis.hourlyRate}/hr
**Total Developer-Hours:** {totalEffortHours}

## Technical Debt

**Total Estimated Hours:** {technicalDebt.totalHours}

### Hours by Category

| Category | Hours |
|----------|-------|
| {category} | {hours} |

### Hours by Severity

| Severity | Hours |
|----------|-------|
| {severity} | {hours} |

## Raw Data

```json
{planJsonData}
```
