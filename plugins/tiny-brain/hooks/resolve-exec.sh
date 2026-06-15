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

# Dev-mode gate: when __TB_DEV_MODE is set in the caller's env, route
# hooks through the workspace's freshly-built tiny-brain CLI instead
# of whatever release is reachable via PATH. Activated per-machine via
# a developer's claude-dev alias; dormant for every other plugin user
# (no env var → block is a no-op).
#
# Walks up from PWD looking for packages/tiny-brain/dist/cli.js — that
# ancestor is the monorepo root. The workspace's hooks/dev-bin/ is
# prepended to PATH so the shim wins `command -v tiny-brain` over any
# host-global binary. EXEC="" preserves the caller's existing
# `$EXEC tiny-brain …` invocation pattern.
if [ -n "${__TB_DEV_MODE:-}" ]; then
  # Use `pwd` builtin rather than $PWD so the walk works even when the
  # caller's env doesn't propagate PWD (hook subprocesses, restricted
  # env wrappers).
  _TB_WS="$(pwd)"
  _TB_FOUND=""
  while [ "$_TB_WS" != "/" ] && [ -n "$_TB_WS" ]; do
    if [ -f "$_TB_WS/packages/tiny-brain/dist/cli.js" ]; then
      _TB_FOUND="$_TB_WS"
      break
    fi
    _TB_WS="$(dirname "$_TB_WS")"
  done
  if [ -z "$_TB_FOUND" ]; then
    echo "[fatal] __TB_DEV_MODE=1 but the workspace tiny-brain CLI is not reachable from $(pwd)." >&2
    echo "[fatal]   Looked for packages/tiny-brain/dist/cli.js by walking up from CWD — no match." >&2
    echo "[fatal]   Build it ('npm run build' at the monorepo root) or unset __TB_DEV_MODE." >&2
    unset _TB_WS _TB_FOUND
    return 1
  fi
  _TB_DEV_BIN="$_TB_FOUND/packages/tiny-brain-plugin/hooks/dev-bin"
  if [ ! -x "$_TB_DEV_BIN/tiny-brain" ]; then
    echo "[fatal] __TB_DEV_MODE=1 but the plugin dev-bin shim is missing or non-executable at $_TB_DEV_BIN/tiny-brain." >&2
    echo "[fatal]   Rebuild the plugin: 'npm run build:plugin' at the monorepo root." >&2
    unset _TB_WS _TB_FOUND _TB_DEV_BIN
    return 1
  fi
  PATH="$_TB_DEV_BIN:$PATH"
  # Exported so the dev-bin shim can `exec node "$__TB_DEV_CLI"`
  # without re-walking the workspace tree.
  export __TB_DEV_CLI="$_TB_FOUND/packages/tiny-brain/dist/cli.js"
  EXEC=""
  # No `--version` probe analogous to the global short-circuit below: a
  # broken workspace cli.js is the developer's own change, and a noisy
  # crash at the next `tiny-brain` invocation is the desired feedback.
  unset _TB_WS _TB_FOUND _TB_DEV_BIN
  return 0
fi

# Prefer a tiny-brain binary already on $PATH: avoids the PM cold-start
# (50–500ms per hook invocation) and works in repos without package.json
# (where pnpm exec / npx fail). Mirrors the short-circuit in
# tiny-brain-core's EXEC_HELPER_CONTENT (.git/hooks/tiny-brain-exec) —
# plugin hooks and git hooks now share the same global-prefer contract.
# Callers do `$EXEC tiny-brain ...` which becomes ` tiny-brain ...` (leading
# space is shell-safe).
#
# CONTRACT: this script must be SOURCED (`. resolve-exec.sh`), not exec'd.
# Probe via `--version`, not just `command -v` — catches dangling shims /
# stale dev-bin builds (same defence as tiny-brain-run-hooks).
if command -v tiny-brain >/dev/null 2>&1 && tiny-brain --version >/dev/null 2>&1; then
  EXEC=""
  return 0
fi

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
unset _PM
