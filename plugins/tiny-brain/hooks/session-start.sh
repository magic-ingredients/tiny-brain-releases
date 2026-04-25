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

# Start dashboard (no-op if already running)
DASH_OUTPUT=$($EXEC tiny-brain dashboard start --if-not-running 2>&1) || true

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
if echo "$DASH_OUTPUT" | grep -q "started on port"; then
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
🎭 Switched to your **${PERSONA}** persona"

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
