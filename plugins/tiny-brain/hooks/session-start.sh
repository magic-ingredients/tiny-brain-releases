#!/bin/bash
#
# session-start.sh - SessionStart hook
#
# Outputs hookSpecificOutput JSON with additionalContext instructing Claude
# to automatically activate the developer persona on first user message.
#
# Output: Structured JSON with additionalContext field (required for
# SessionStart hooks to surface content to Claude).
#

INSTRUCTION="AUTOMATIC PERSONA ACTIVATION

A tiny-brain plugin is configured for this repository.
You MUST automatically activate the developer persona by calling the \`mcp__plugin_tiny-brain_mcp__as\` tool with \`personaName: \"developer\"\` and showing the full raw output.
Do this immediately as your first action before responding to the user's message."

# Output structured JSON using jq for proper escaping
jq -n --arg ctx "$INSTRUCTION" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $ctx
  }
}'
