#!/bin/bash
#
# adversarial-review.sh - PostToolUse hook (matcher: Bash)
#
# Detects non-trivial feat:/fix: commits and instructs Claude to invoke
# the adversarial-reviewer agent for critical review from an isolated context.
#
# Triviality is determined by the hook -- Claude only sees the instruction
# when review is actually warranted.
#
# Input: JSON on stdin with tool_input.command
#
# Output: Structured JSON with additionalContext field (required for
# PostToolUse hooks to surface content to Claude). Plain stdout is
# only visible in verbose mode (Ctrl+O) and is NOT added to context.
#

# --- Gate 1: Was this a git commit command? ---
INPUT=$(cat)
if ! echo "$INPUT" | grep -q 'git commit'; then
  echo "[adversarial-review] skip: not a git commit command" >&2
  exit 0
fi

# --- Gate 2: Is the latest commit a feat:/fix: commit? ---
LATEST_MSG=$(git log -1 --format='%s' 2>/dev/null) || { echo "[adversarial-review] skip: git log failed" >&2; exit 0; }
COMMIT_SHA=$(git log -1 --format='%h' 2>/dev/null)

# If latest is a chore: progress auto-commit, look one commit back
if echo "$LATEST_MSG" | grep -qE '^chore:.*progress'; then
  LATEST_MSG=$(git log --format='%s' --skip=1 -1 2>/dev/null)
  COMMIT_SHA=$(git log --format='%h' --skip=1 -1 2>/dev/null)
fi

if ! echo "$LATEST_MSG" | grep -qE '^(feat|fix)(\([^)]+\))?:'; then
  echo "[adversarial-review] skip: not a feat:/fix: commit (was: $LATEST_MSG)" >&2
  exit 0
fi

# --- Gate 3: Is this a non-trivial change? ---
NUMSTAT=$(git show --numstat --format='' "$COMMIT_SHA" 2>/dev/null)
TOTAL_LINES=$(echo "$NUMSTAT" | awk '{s+=$1+$2} END {print s+0}')
FILE_PATHS=$(echo "$NUMSTAT" | awk '{print $3}')

# Skip: 3 or fewer lines changed (single-line fixes, typos)
if [ "$TOTAL_LINES" -le 3 ]; then
  echo "[adversarial-review] skip: trivial change ($TOTAL_LINES lines changed)" >&2
  exit 0
fi

# Skip: only config/docs/lock files changed
SOURCE_FILES=$(echo "$FILE_PATHS" | grep -cvE '\.(json|md|lock|config\.[a-z]+)$' || true)
if [ "$SOURCE_FILES" -eq 0 ]; then
  echo "[adversarial-review] skip: no source files changed (only config/docs/lock)" >&2
  exit 0
fi

# --- Non-trivial feat:/fix: commit -- output adversarial review instruction ---

# Extract tracking headers from the current commit body
FULL_MSG=$(git log -1 --format='%B' "$COMMIT_SHA" 2>/dev/null)
CURRENT_FIX=$(echo "$FULL_MSG" | grep '^Fix:' | head -1 | sed 's/^Fix:[[:space:]]*//')
CURRENT_PRD=$(echo "$FULL_MSG" | grep '^PRD:' | head -1 | sed 's/^PRD:[[:space:]]*//')
CURRENT_FEATURE=$(echo "$FULL_MSG" | grep '^Feature:' | head -1 | sed 's/^Feature:[[:space:]]*//')
CURRENT_TASK=$(echo "$FULL_MSG" | grep '^Task:' | head -1 | sed 's/^Task:[[:space:]]*//')

HAS_HEADERS=""
if [ -n "$CURRENT_FIX" ]; then
  HAS_HEADERS="fix"
elif [ -n "$CURRENT_PRD" ] && [ -n "$CURRENT_FEATURE" ]; then
  HAS_HEADERS="prd"
fi

TEST_SHA=""
if [ -n "$HAS_HEADERS" ]; then
  TEST_CANDIDATES=$(git log --format='%h %s' -20 2>/dev/null \
    | grep -E '^[a-f0-9]+ test(\([^)]+\))?:' \
    | cut -d' ' -f1)

  for CANDIDATE in $TEST_CANDIDATES; do
    CANDIDATE_MSG=$(git log -1 --format='%B' "$CANDIDATE" 2>/dev/null)
    if [ "$HAS_HEADERS" = "fix" ]; then
      CANDIDATE_FIX=$(echo "$CANDIDATE_MSG" | grep '^Fix:' | head -1 | sed 's/^Fix:[[:space:]]*//')
      if [ "$CANDIDATE_FIX" = "$CURRENT_FIX" ]; then
        TEST_SHA="$CANDIDATE"; break
      fi
    elif [ "$HAS_HEADERS" = "prd" ]; then
      CANDIDATE_PRD=$(echo "$CANDIDATE_MSG" | grep '^PRD:' | head -1 | sed 's/^PRD:[[:space:]]*//')
      CANDIDATE_FEATURE=$(echo "$CANDIDATE_MSG" | grep '^Feature:' | head -1 | sed 's/^Feature:[[:space:]]*//')
      if [ "$CANDIDATE_PRD" = "$CURRENT_PRD" ] && [ "$CANDIDATE_FEATURE" = "$CURRENT_FEATURE" ]; then
        TEST_SHA="$CANDIDATE"; break
      fi
    fi
  done
fi

if [ -n "$TEST_SHA" ]; then
  echo "[adversarial-review] matched test commit $TEST_SHA by ${HAS_HEADERS} headers" >&2
elif [ -n "$HAS_HEADERS" ]; then
  echo "[adversarial-review] no matching test: commit found for ${HAS_HEADERS} headers" >&2
else
  echo "[adversarial-review] no tracking headers -- skipping test commit lookup" >&2
fi

TASK_DESC=$(echo "$LATEST_MSG" | sed -E 's/^[a-z]+(\([^)]+\))?:[[:space:]]*//')

# --- Set adversarialStartedAt via update-phase ---
if [ -n "$CURRENT_TASK" ]; then
  UPDATE_ARGS="--task \"$CURRENT_TASK\" --phase adversarial --event start"
  if [ -n "$CURRENT_FIX" ]; then
    UPDATE_ARGS="$UPDATE_ARGS --fix \"$CURRENT_FIX\""
  elif [ -n "$CURRENT_PRD" ] && [ -n "$CURRENT_FEATURE" ]; then
    UPDATE_ARGS="$UPDATE_ARGS --prd \"$CURRENT_PRD\" --feature \"$CURRENT_FEATURE\""
  fi
  eval npx tiny-brain update-phase $UPDATE_ARGS 2>/dev/null || true
  echo "[adversarial-review] set adversarialStartedAt via update-phase" >&2
fi

# Build the instruction message
INSTRUCTION="ADVERSARIAL REVIEW REQUIRED

A non-trivial feat: commit was detected ($COMMIT_SHA).
You MUST now invoke the adversarial reviewer for critical review from an isolated context before proceeding.

Use the Task tool with:
  subagent_type: tiny-brain:adversarial-reviewer
  prompt: |
    Review the following TDD work:"

if [ -n "$TEST_SHA" ]; then
  INSTRUCTION="$INSTRUCTION
    - Test commit: $TEST_SHA"
fi

INSTRUCTION="$INSTRUCTION
    - Implementation commit: $COMMIT_SHA
    - Task: $TASK_DESC
    Critically analyze the test quality and implementation.
    Return structured JSON refactoring suggestions.

After review, implement suggestions as refactor(scope): commits."

# Add update-phase completion instruction if we have tracking headers
if [ -n "$CURRENT_TASK" ]; then
  PHASE_ARGS="--task '$CURRENT_TASK' --phase adversarial --event complete"
  if [ -n "$CURRENT_FIX" ]; then
    PHASE_ARGS="$PHASE_ARGS --fix '$CURRENT_FIX'"
  elif [ -n "$CURRENT_PRD" ] && [ -n "$CURRENT_FEATURE" ]; then
    PHASE_ARGS="$PHASE_ARGS --prd '$CURRENT_PRD' --feature '$CURRENT_FEATURE'"
  fi
  INSTRUCTION="$INSTRUCTION
After the adversarial review completes, run:
  npx tiny-brain update-phase $PHASE_ARGS"
fi

INSTRUCTION="$INSTRUCTION
When the TDD cycle is complete, run:
  npx tiny-brain commit-progress"

# Output structured JSON using jq for proper escaping
# Per docs: additionalContext in hookSpecificOutput is added to Claude's context
jq -n --arg ctx "$INSTRUCTION" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'
