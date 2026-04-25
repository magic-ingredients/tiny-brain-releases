#!/bin/sh
#
# resolve-exec.sh — Package manager exec resolver for plugin hooks
#
# Reads .tiny-brain/analysis.json packageManager field and sets $EXEC.
# Source this at the top of hook scripts:
#   . "$(dirname "$0")/resolve-exec.sh"
#
# Sets: EXEC — the exec command (e.g. "pnpm exec", "npx", "bunx")
#

_PM=$(grep -o '"packageManager" *: *"[^"]*"' .tiny-brain/analysis.json 2>/dev/null | grep -o '"[^"]*"$' | tr -d '"')
if [ -f ".tiny-brain/analysis.json" ] && [ -z "$_PM" ]; then
  echo "[warn] could not read packageManager from analysis.json" >&2
fi
case "${_PM:-npm}" in
  pnpm) EXEC="pnpm exec" ;;
  yarn) EXEC="yarn exec" ;;
  bun)  EXEC="bunx" ;;
  *)    EXEC="npx" ;;
esac
