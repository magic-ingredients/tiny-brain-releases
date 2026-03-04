import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';

const SCRIPT_PATH = path.resolve(__dirname, '..', 'session-start.sh');

describe('session-start.sh', () => {
  it('should exit with code 0', () => {
    expect(() => {
      execSync(`bash "${SCRIPT_PATH}"`, { encoding: 'utf-8' });
    }).not.toThrow();
  });

  it('should output valid JSON with correct hookSpecificOutput structure', () => {
    const stdout = execSync(`bash "${SCRIPT_PATH}"`, { encoding: 'utf-8' });
    const parsed = JSON.parse(stdout);

    expect(parsed).toHaveProperty('hookSpecificOutput');
    expect(parsed.hookSpecificOutput).toHaveProperty('hookEventName', 'SessionStart');
    expect(parsed.hookSpecificOutput).toHaveProperty('additionalContext');
    expect(typeof parsed.hookSpecificOutput.additionalContext).toBe('string');
  });

  it('should include automatic persona activation instruction in additionalContext', () => {
    const stdout = execSync(`bash "${SCRIPT_PATH}"`, { encoding: 'utf-8' });
    const parsed = JSON.parse(stdout);
    const ctx = parsed.hookSpecificOutput.additionalContext;

    expect(ctx).toContain('mcp__plugin_tiny-brain_mcp__as');
    expect(ctx).toContain('developer');
    expect(ctx).toContain('automatically activate');
  });
});
