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
        PATH: `${fakeBinDir}:/usr/bin:/bin`,
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
        PATH: `${fakeBinDir}:/usr/bin:/bin`,
      });
      const parsed = JSON.parse(stdout);
      const ctx = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('architect');
      expect(ctx).not.toContain('mcp__plugin_tiny-brain_mcp__as');
    });
  });

  describe('when __TB_DEV_MODE=1', () => {
    // Branch the hook takes inside the `claude-tb` alias: don't try to
    // spawn a detached prod daemon, just report whether the user's
    // foreground `tiny-brain dashboard dev` is up on 8765.
    let fakeBinDir: string;

    function writeLsof(pidOutput: string): void {
      const fakeLsof = path.join(fakeBinDir, 'lsof');
      // The hook calls `lsof -ti :8765`. We only emit when the args
      // match — anything else passes through so we don't poison
      // unrelated calls from child processes.
      fs.writeFileSync(
        fakeLsof,
        `#!/bin/bash
if [[ "$*" == "-ti :8765" ]]; then
  ${pidOutput ? `echo "${pidOutput}"` : 'exit 1'}
  exit 0
fi
exec /usr/sbin/lsof "$@"
`,
      );
      fs.chmodSync(fakeLsof, '755');
    }

    beforeAll(() => {
      fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tb-test-dev-'));
    });

    afterAll(() => {
      fs.rmSync(fakeBinDir, { recursive: true });
    });

    it('hints to start the dev daemon when 8765 is free', () => {
      writeLsof('');
      const stdout = runScript({
        __TB_DEV_MODE: '1',
        TINY_BRAIN_DEFAULT_PERSONA: '',
        PATH: `${fakeBinDir}:/usr/bin:/bin`,
      });
      const ctx = JSON.parse(stdout).hookSpecificOutput.additionalContext;

      expect(ctx).toContain('Dev mode');
      expect(ctx).toContain('tiny-brain dashboard dev');
      // Must NOT use the prod auto-spawn copy:
      expect(ctx).not.toContain('Dashboard running at');
    });

    it('reports dev-mode URL when 8765 is in use', () => {
      writeLsof('99999');
      const stdout = runScript({
        __TB_DEV_MODE: '1',
        TINY_BRAIN_DEFAULT_PERSONA: '',
        PATH: `${fakeBinDir}:/usr/bin:/bin`,
      });
      const ctx = JSON.parse(stdout).hookSpecificOutput.additionalContext;

      expect(ctx).toContain('dev mode');
      expect(ctx).toContain('http://localhost:8765');
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
      // PATH-isolated: fakeBinDir + minimal system bins ONLY. Inheriting
      // process.env.PATH would let resolve-exec.sh's `command -v tiny-brain`
      // short-circuit find a global / dev-bin tiny-brain on the host
      // (per tiny-brain-exec-prefer-global-binary Task 4), so EXEC becomes
      // empty and `tiny-brain as developer` runs the real binary instead
      // of hitting the fake-npx failure path under test.
      const stdout = runScript({
        TINY_BRAIN_DEFAULT_PERSONA: 'developer',
        PATH: `${fakeBinDir}:/usr/bin:/bin`,
      });
      const parsed = JSON.parse(stdout);
      const ctx = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('mcp__plugin_tiny-brain_mcp__as');
      expect(ctx).toContain('AUTOMATIC PERSONA ACTIVATION');
    });

    it('should include persona name in MCP fallback instruction', () => {
      const stdout = runScript({
        TINY_BRAIN_DEFAULT_PERSONA: 'architect',
        PATH: `${fakeBinDir}:/usr/bin:/bin`,
      });
      const parsed = JSON.parse(stdout);
      const ctx = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('mcp__plugin_tiny-brain_mcp__as');
      expect(ctx).toContain('architect');
    });
  });
});
