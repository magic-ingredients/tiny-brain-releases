import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const SCRIPT_PATH = path.resolve(__dirname, '..', 'session-start.sh');

const execOpts: ExecSyncOptionsWithStringEncoding = { encoding: 'utf-8' };

function runScript(env: Record<string, string> = {}): string {
  return execSync(`bash "${SCRIPT_PATH}"`, {
    ...execOpts,
    env: { ...process.env, ...env },
  });
}

describe('session-start.sh', () => {
  it('should exit with code 0 when using config fallback', () => {
    expect(() => {
      execSync(`bash "${SCRIPT_PATH}"`, execOpts);
    }).not.toThrow();
  });

  it('should output valid JSON with additionalContext', () => {
    const stdout = execSync(`bash "${SCRIPT_PATH}"`, execOpts);
    const parsed = JSON.parse(stdout);

    expect(parsed).toHaveProperty('hookSpecificOutput');
    expect(parsed.hookSpecificOutput).toHaveProperty('hookEventName', 'SessionStart');
    expect(parsed.hookSpecificOutput).toHaveProperty('additionalContext');
    expect(typeof parsed.hookSpecificOutput.additionalContext).toBe('string');
  });

  it('should output JSON with startup summary when TINY_BRAIN_DEFAULT_PERSONA is empty', () => {
    const stdout = runScript({ TINY_BRAIN_DEFAULT_PERSONA: '' });
    const parsed = JSON.parse(stdout);

    expect(parsed.hookSpecificOutput.hookEventName).toBe('SessionStart');
    expect(parsed.hookSpecificOutput.additionalContext).toContain('🧠 tiny-brain started!');
  });

  describe('when CLI succeeds', () => {
    let fakeBinDir: string;

    beforeAll(() => {
      // Create a temp directory with a fake npx that returns CLI output
      // for "tiny-brain as" commands, and passes through others
      fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tb-test-cli-'));
      const fakeNpx = path.join(fakeBinDir, 'npx');
      fs.writeFileSync(
        fakeNpx,
        `#!/bin/bash
if [[ "$1" == "tiny-brain" && "$2" == "as" ]]; then
  echo "# THIS IS YOUR CONTEXT"
  echo "## PERSONA: $3"
  exit 0
fi
# Pass through to real npx for other commands
exec "$(which -a npx | grep -v "${fakeBinDir}" | head -1)" "$@"
`,
      );
      fs.chmodSync(fakeNpx, '755');
    });

    afterAll(() => {
      fs.rmSync(fakeBinDir, { recursive: true });
    });

    it('should use CLI output directly in additionalContext', () => {
      const stdout = runScript({
        TINY_BRAIN_DEFAULT_PERSONA: 'developer',
        PATH: `${fakeBinDir}:${process.env['PATH'] ?? ''}`,
      });
      const parsed = JSON.parse(stdout);
      const ctx = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('# THIS IS YOUR CONTEXT');
      expect(ctx).toContain('PERSONA: developer');
      expect(ctx).not.toContain('mcp__plugin_tiny-brain_mcp__as');
    });

    it('should include persona name in CLI output', () => {
      const stdout = runScript({
        TINY_BRAIN_DEFAULT_PERSONA: 'architect',
        PATH: `${fakeBinDir}:${process.env['PATH'] ?? ''}`,
      });
      const parsed = JSON.parse(stdout);
      const ctx = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('architect');
      expect(ctx).not.toContain('mcp__plugin_tiny-brain_mcp__as');
    });
  });

  describe('when CLI fails', () => {
    let fakeBinDir: string;

    beforeAll(() => {
      // Create a fake npx that always fails for "tiny-brain as"
      fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tb-test-fallback-'));
      const fakeNpx = path.join(fakeBinDir, 'npx');
      fs.writeFileSync(
        fakeNpx,
        `#!/bin/bash
if [[ "$1" == "tiny-brain" && "$2" == "as" ]]; then
  exit 1
fi
# Pass through to real npx for other commands
exec "$(which -a npx | grep -v "${fakeBinDir}" | head -1)" "$@"
`,
      );
      fs.chmodSync(fakeNpx, '755');
    });

    afterAll(() => {
      fs.rmSync(fakeBinDir, { recursive: true });
    });

    it('should fall back to MCP tool instruction', () => {
      const stdout = runScript({
        TINY_BRAIN_DEFAULT_PERSONA: 'developer',
        PATH: `${fakeBinDir}:${process.env['PATH'] ?? ''}`,
      });
      const parsed = JSON.parse(stdout);
      const ctx = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('mcp__plugin_tiny-brain_mcp__as');
      expect(ctx).toContain('AUTOMATIC PERSONA ACTIVATION');
    });

    it('should include persona name in MCP fallback instruction', () => {
      const stdout = runScript({
        TINY_BRAIN_DEFAULT_PERSONA: 'architect',
        PATH: `${fakeBinDir}:${process.env['PATH'] ?? ''}`,
      });
      const parsed = JSON.parse(stdout);
      const ctx = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('mcp__plugin_tiny-brain_mcp__as');
      expect(ctx).toContain('architect');
    });
  });
});
