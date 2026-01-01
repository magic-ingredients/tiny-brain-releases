#!/bin/bash
#
# TDD Enforcement Hook
# Validates that failing tests exist before allowing file writes
#
# This script is called by Claude Code PreToolUse hook for Write/Edit operations.
# It checks for failing tests in the test results file and blocks writes if none exist.
#

set -e

# Configuration
TDD_GUARD_DIR=".claude/tdd-guard"
TEST_RESULTS_FILE="$TDD_GUARD_DIR/data/test.json"
CONFIG_FILE="$TDD_GUARD_DIR/config.json"

# Check if TDD enforcement is disabled
if [ -f "$CONFIG_FILE" ]; then
  TDD_ENABLED=$(cat "$CONFIG_FILE" 2>/dev/null | grep -o '"enabled":\s*\(true\|false\)' | grep -o '\(true\|false\)' || echo "true")
  if [ "$TDD_ENABLED" = "false" ]; then
    # TDD enforcement disabled, allow write
    exit 0
  fi
fi

# Check if test results file exists
if [ ! -f "$TEST_RESULTS_FILE" ]; then
  # No test results yet - this could be first run or tests haven't been run
  # Allow write but warn
  echo "Warning: No test results found at $TEST_RESULTS_FILE"
  echo "Run tests with a tiny-brain reporter to enable TDD enforcement."
  exit 0
fi

# Check test results age (stale after 5 minutes)
if [ -f "$TEST_RESULTS_FILE" ]; then
  FILE_AGE=$(($(date +%s) - $(stat -f %m "$TEST_RESULTS_FILE" 2>/dev/null || stat -c %Y "$TEST_RESULTS_FILE" 2>/dev/null || echo 0)))
  if [ "$FILE_AGE" -gt 300 ]; then
    echo "Warning: Test results are stale (${FILE_AGE}s old). Run tests again."
    # Allow write but warn about stale results
    exit 0
  fi
fi

# Parse test results
FAILED_COUNT=$(cat "$TEST_RESULTS_FILE" 2>/dev/null | grep -o '"failed":\s*[0-9]*' | grep -o '[0-9]*' || echo "0")

# Check for failing tests
if [ "$FAILED_COUNT" = "0" ]; then
  # No failing tests - block the write
  cat << 'EOF'

TDD Violation: No failing tests detected.

Before writing implementation code, you must:
1. Write a failing test that describes the expected behavior
2. Run the tests to capture the failure
3. Then write the implementation

To run tests with result capture:
  npm test          # Uses configured reporter
  npx vitest        # Vitest with tiny-brain reporter
  npx jest          # Jest with tiny-brain reporter

To temporarily disable TDD enforcement:
  Run: ./hooks/tdd-toggle.sh off

EOF
  exit 1
fi

# Failing tests exist - allow the write
echo "TDD Check: $FAILED_COUNT failing test(s) found. Write allowed."
exit 0
