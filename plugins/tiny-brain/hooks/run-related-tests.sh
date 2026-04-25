#!/bin/sh
#
# run-related-tests.sh - Run related test after Write/Edit
#
# Input: JSON on stdin with tool_input.file_path
#

# Resolve package manager exec command from analysis.json
. "$(dirname "$0")/resolve-exec.sh"

FILE_PATH=$(sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

# Skip if no file path or not a TS/TSX file
[ -z "$FILE_PATH" ] && exit 0
echo "$FILE_PATH" | grep -qE '\.(ts|tsx)$' || exit 0

# Skip non-source files (configs, scripts, etc.)
echo "$FILE_PATH" | grep -qE '(node_modules|dist|\.config\.|\.json$)' && exit 0

# Determine the working directory (package dir for monorepos, repo root otherwise)
WORK_DIR=$(echo "$FILE_PATH" | sed -n 's|\(.*/packages/[^/]*\)/.*|\1|p')
if [ -z "$WORK_DIR" ]; then
  # Not in packages/ - use git repo root
  WORK_DIR=$(git rev-parse --show-toplevel 2>/dev/null)
  [ -z "$WORK_DIR" ] && exit 0
fi

# Find the test file
if echo "$FILE_PATH" | grep -qE '\.test\.(ts|tsx)$'; then
  TEST_FILE="$FILE_PATH"
else
  DIR=$(dirname "$FILE_PATH")
  BASE=$(basename "$FILE_PATH" | sed 's/\.\(ts\|tsx\)$//')
  TEST_FILE=""

  # Check __tests__/name.test.ts(x)
  for ext in ts tsx; do
    if [ -f "$DIR/__tests__/$BASE.test.$ext" ]; then
      TEST_FILE="$DIR/__tests__/$BASE.test.$ext"
      break
    fi
  done

  # Check co-located name.test.ts(x)
  if [ -z "$TEST_FILE" ]; then
    for ext in ts tsx; do
      if [ -f "$DIR/$BASE.test.$ext" ]; then
        TEST_FILE="$DIR/$BASE.test.$ext"
        break
      fi
    done
  fi

  [ -z "$TEST_FILE" ] && exit 0
fi

# Run the test from the working directory
cd "$WORK_DIR" && $EXEC vitest run "$TEST_FILE" 2>&1 | tail -5 || true
