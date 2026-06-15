#!/bin/bash
#
# session-start.sh - SessionStart hook
#
# Outputs hookSpecificOutput JSON with additionalContext containing
# persona context for the session.
#
# Tries to call tiny-brain as <persona> using the detected package manager.
# Falls back to instructing Claude to call the MCP tool if CLI fails.
#
# The persona name is read from config (defaultPersona preference).
# Set TINY_BRAIN_DEFAULT_PERSONA env var to override (used in tests).
# Set defaultPersona to "" to disable auto-activation.
#
# Output: Structured JSON with additionalContext field (required for
# SessionStart hooks to surface content to Claude).
#

# Resolve package manager exec command from analysis.json
. "$(dirname "$0")/resolve-exec.sh"

# Dashboard handling.
#
# `claude-tb` (or any caller that sets __TB_DEV_MODE=1) signals dev
# mode: the user manages a foreground `tiny-brain dashboard dev`
# themselves so they get HMR + tsx-watch + logs. Do NOT auto-spawn a
# detached prod daemon here — that would race the dev daemon for port
# 8765 and serve stale built dist files. Just report whether dev is up.
if [ "$__TB_DEV_MODE" = "1" ]; then
  if lsof -ti :8765 >/dev/null 2>&1; then
    DASH_OUTPUT="__DEV_RUNNING__"
  else
    DASH_OUTPUT="__DEV_NOT_RUNNING__"
  fi
else
  # Production mode: spawn detached daemon if needed.
  DASH_OUTPUT=$($EXEC tiny-brain dashboard start --if-not-running 2>&1) || true
fi

# Use env var if set, otherwise read from config, fall back to "developer"
if [ -n "${TINY_BRAIN_DEFAULT_PERSONA+x}" ]; then
  PERSONA="$TINY_BRAIN_DEFAULT_PERSONA"
else
  RAW=$($EXEC tiny-brain config preferences get defaultPersona 2>/dev/null)
  # Strip "defaultPersona: " prefix from CLI output
  PERSONA="${RAW#defaultPersona: }"
  PERSONA="${PERSONA:-developer}"
fi

# Build startup summary for user display
SUMMARY="🧠 tiny-brain started!"

# Dashboard line
if [ "$DASH_OUTPUT" = "__DEV_RUNNING__" ]; then
  SUMMARY="${SUMMARY}
🔥 Dashboard (dev mode) at [http://localhost:8765](http://localhost:8765)"
elif [ "$DASH_OUTPUT" = "__DEV_NOT_RUNNING__" ]; then
  SUMMARY="${SUMMARY}
🔥 Dev mode — start the dashboard with \`tiny-brain dashboard dev\` in a terminal"
elif echo "$DASH_OUTPUT" | grep -q "started on port"; then
  DASH_PORT=$(echo "$DASH_OUTPUT" | grep -o 'port [0-9]*' | head -1 | grep -o '[0-9]*')
  SUMMARY="${SUMMARY}
📊 Dashboard running at [http://localhost:${DASH_PORT:-8765}](http://localhost:${DASH_PORT:-8765})"
elif echo "$DASH_OUTPUT" | grep -q "already running"; then
  SUMMARY="${SUMMARY}
📊 Dashboard running at [http://localhost:8765](http://localhost:8765)"
else
  SUMMARY="${SUMMARY}
📊 Dashboard not available"
fi

# If persona is empty, report startup only and exit
if [ -z "$PERSONA" ]; then
  CONTEXT="IMPORTANT: Display the following startup summary to the user exactly as written (preserve markdown and emoji):

${SUMMARY}"
  jq -n --arg ctx "$CONTEXT" '{
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: $ctx
    }
  }'
  exit 0
fi

# Try CLI first — embeds persona context directly (no extra MCP tool call)
CLI_OUTPUT=$($EXEC tiny-brain as "$PERSONA" 2>/dev/null)

if [ -n "$CLI_OUTPUT" ]; then
  CONTEXT="$CLI_OUTPUT"
else
  # Fall back to MCP tool instruction
  CONTEXT="AUTOMATIC PERSONA ACTIVATION

A tiny-brain plugin is configured for this repository.
You MUST automatically activate the ${PERSONA} persona by calling the \`mcp__plugin_tiny-brain_mcp__as\` tool with \`personaName: \"${PERSONA}\"\` and showing the full raw output.
Do this immediately as your first action before responding to the user's message."
fi

# Add persona line to summary
SUMMARY="${SUMMARY}
🎭 Using the **${PERSONA}** persona"

# Append display instruction
CONTEXT="${CONTEXT}

IMPORTANT: Display the following startup summary to the user exactly as written (preserve markdown and emoji):

${SUMMARY}"

# Output structured JSON using jq for proper escaping
jq -n --arg ctx "$CONTEXT" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $ctx
  }
}'
