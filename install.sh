#!/bin/sh
# tiny-brain curl installer (install-dx F3 curl-door).
#
#   curl -fsSL <raw-url> | sh
#
# Deliberately thin: preflight Node >= 18, then hand off to the npx one-shot
# engine. Zero install logic is duplicated here — `npx … install` runs the
# same engine as `brew`/`tiny-brain install`, so this door can never drift
# from the others.

set -u

MIN_NODE_MAJOR=18
PKG="@magic-ingredients/tiny-brain"

err() {
  printf '%s\n' "$*" >&2
}

if ! command -v node >/dev/null 2>&1; then
  err "tiny-brain needs Node.js >= ${MIN_NODE_MAJOR}, but 'node' was not found."
  err "Install Node from https://nodejs.org/ (or via nvm) and re-run this installer."
  exit 1
fi

# Parse the major version with POSIX parameter expansion (no sed/awk) so the
# script has no dependency beyond node/npx and the shell itself.
NODE_VERSION=$(node --version 2>/dev/null)   # e.g. v20.11.0
node_major=${NODE_VERSION#v}                 # strip leading 'v' -> 20.11.0
node_major=${node_major%%.*}                 # take major          -> 20

case "$node_major" in
  '' | *[!0-9]*)
    err "Could not determine the Node.js version (got '${NODE_VERSION}')."
    err "Install Node >= ${MIN_NODE_MAJOR} from https://nodejs.org/ and re-run this installer."
    exit 1
    ;;
esac

if [ "$node_major" -lt "$MIN_NODE_MAJOR" ]; then
  err "tiny-brain needs Node.js >= ${MIN_NODE_MAJOR}, but ${NODE_VERSION} is installed."
  err "Upgrade Node from https://nodejs.org/ (or via nvm) and re-run this installer."
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  err "tiny-brain needs npx (bundled with npm), but 'npx' was not found."
  err "Reinstall Node/npm from https://nodejs.org/ and re-run this installer."
  exit 1
fi

# Hand off to the engine. exec replaces this shell, so the installer's exit
# code IS the engine's — a verified end state (0) or an unverified target
# (non-zero) propagates straight to the caller of `curl … | sh`.
exec npx -y "$PKG" install
