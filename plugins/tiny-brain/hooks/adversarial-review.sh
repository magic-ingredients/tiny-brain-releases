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

# Resolve package manager exec command from analysis.json
. "$(dirname "$0")/resolve-exec.sh"

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

# --- Read first review type from pipeline config ---
PIPELINE_JSON=$($EXEC tiny-brain config preferences get reviewPipeline 2>/dev/null | sed 's/^reviewPipeline:[[:space:]]*//')
FIRST_REVIEW_TYPE=""
if [ -n "$PIPELINE_JSON" ] && command -v jq >/dev/null 2>&1; then
  FIRST_REVIEW_TYPE=$(echo "$PIPELINE_JSON" | jq -r '[.[] | select(.hook == null)][0].type // empty' 2>/dev/null)
fi
if [ -z "$FIRST_REVIEW_TYPE" ]; then
  FIRST_REVIEW_TYPE="adversarial"
fi
echo "[adversarial-review] first review type in pipeline: $FIRST_REVIEW_TYPE" >&2

# Build the instruction message
INSTRUCTION="ADVERSARIAL REVIEW REQUIRED

A non-trivial feat:/fix: commit was detected ($COMMIT_SHA).
You MUST now invoke the adversarial reviewer before proceeding with any other work.

Use the Agent tool with:
  subagent_type: tiny-brain:${FIRST_REVIEW_TYPE}-reviewer
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
    Return structured JSON refactoring suggestions."

PIPELINE_ARGS="--task-id '$CURRENT_TASK' --agent $FIRST_REVIEW_TYPE --sha $COMMIT_SHA"
if [ -n "$CURRENT_FIX" ]; then
  PIPELINE_ARGS="$PIPELINE_ARGS --fix '$CURRENT_FIX'"
elif [ -n "$CURRENT_PRD" ] && [ -n "$CURRENT_FEATURE" ]; then
  PIPELINE_ARGS="$PIPELINE_ARGS --prd '$CURRENT_PRD' --feature '$CURRENT_FEATURE'"
fi

INSTRUCTION="$INSTRUCTION

    After persisting review JSON, advance the pipeline (replace <verdict> with: clean or dirty):
  $EXEC tiny-brain pipeline $PIPELINE_ARGS --decision <verdict>

After the ${FIRST_REVIEW_TYPE} review agent returns, tell the user:
  - If verdict is needs-refactoring: '🧠 😈 Adversarial review complete for: [task] — refactoring needed'
  - If verdict is clean: '🧠 😈 Adversarial review complete for: [task] — clean, no refactor needed'
Then implement refactor suggestions as refactor(scope): commits if needed.
When the TDD cycle is complete, run: $EXEC tiny-brain commit progress"

# Output structured JSON using jq for proper escaping
# Per docs: additionalContext in hookSpecificOutput is added to Claude's context
jq -n --arg ctx "$INSTRUCTION" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'
