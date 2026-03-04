#!/bin/bash
#
# sync-progress.sh - Post-tool-use hook for syncing progress.json
#
# Called after Write/Edit operations to sync PRD/feature/fix markdown
# files to their corresponding progress.json files.
#
# Input: JSON on stdin with tool_input.file_path
#

# Read file path from stdin JSON (no jq dependency)
FILE_PATH=$(sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

# Exit silently if no file path
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only process markdown files in specific locations:
# - .tiny-brain/fixes/*.md (fix documents)
# - docs/prd/**/*.md (PRD and feature files)

# Check if this is a fix markdown file
if [[ "$FILE_PATH" =~ \.tiny-brain/fixes/.*\.md$ ]]; then
  echo ""
  echo "🧠 Syncing fix progress: $(basename "$FILE_PATH")"
  npx tiny-brain sync-progress "$FILE_PATH" || true
  exit 0
fi

# Check if this is a PRD or feature markdown file
if [[ "$FILE_PATH" =~ docs/prd/.*\.md$ ]]; then
  echo ""
  echo "🧠 Syncing PRD progress: $(basename "$FILE_PATH")"
  npx tiny-brain sync-progress "$FILE_PATH" || true
  exit 0
fi

# Non-matching file - exit silently
exit 0
