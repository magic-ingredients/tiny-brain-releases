import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const MANIFEST_PATH = path.resolve(__dirname, '..', 'hooks.json');

interface HookCommand {
  type: string;
  command: string;
}

interface HookGroup {
  matcher?: string;
  hooks: HookCommand[];
}

interface HooksManifest {
  $schema?: string;
  hooks: Record<string, HookGroup[] | undefined>;
}

function loadManifest(): HooksManifest {
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  return JSON.parse(raw) as HooksManifest;
}

function allCommands(manifest: HooksManifest): string[] {
  const out: string[] = [];
  for (const groups of Object.values(manifest.hooks)) {
    if (!groups) continue;
    for (const group of groups) {
      for (const hook of group.hooks) {
        out.push(hook.command);
      }
    }
  }
  return out;
}

describe('hooks.json — trimmed, single-source-of-truth registration', () => {
  it('registers SessionStart → ${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh', () => {
    const manifest = loadManifest();
    const sessionStart = manifest.hooks['SessionStart'] ?? [];

    expect(sessionStart).toHaveLength(1);
    expect(sessionStart[0]?.hooks).toHaveLength(1);
    const command = sessionStart[0]?.hooks[0]?.command ?? '';
    expect(command).toContain('${CLAUDE_PLUGIN_ROOT}');
    expect(command).toContain('session-start.sh');
  });

  it('registers PostToolUse(Write|Edit) → ${CLAUDE_PLUGIN_ROOT}/hooks/sync-progress.sh as the only entry', () => {
    const manifest = loadManifest();
    const postToolUse = manifest.hooks['PostToolUse'] ?? [];
    const writeEditGroup = postToolUse.find((g) => g.matcher === 'Write|Edit');

    expect(writeEditGroup).toBeDefined();
    expect(writeEditGroup?.hooks).toHaveLength(1);
    const command = writeEditGroup?.hooks[0]?.command ?? '';
    expect(command).toContain('${CLAUDE_PLUGIN_ROOT}');
    expect(command).toContain('sync-progress.sh');
  });

  it('does not register a PostToolUse(Bash) matcher', () => {
    const manifest = loadManifest();
    const postToolUse = manifest.hooks['PostToolUse'] ?? [];
    const bashGroup = postToolUse.find((g) => g.matcher === 'Bash');

    expect(bashGroup).toBeUndefined();
  });

  it('does not reference adversarial-review.sh anywhere', () => {
    const commands = allCommands(loadManifest());
    expect(commands.some((c) => c.includes('adversarial-review.sh'))).toBe(false);
  });

  it('does not reference run-related-tests.sh anywhere', () => {
    const commands = allCommands(loadManifest());
    expect(commands.some((c) => c.includes('run-related-tests.sh'))).toBe(false);
  });

  it('does not run inline eslint or tsc on Write|Edit', () => {
    const commands = allCommands(loadManifest());
    expect(commands.some((c) => /\beslint\b/.test(c))).toBe(false);
    expect(commands.some((c) => /\btsc\b/.test(c))).toBe(false);
  });

  it('does not register a $CLAUDE_PROJECT_DIR-relative path (would break in worktrees)', () => {
    const commands = allCommands(loadManifest());
    const scriptCommands = commands.filter((c) => c.includes('.sh'));
    for (const command of scriptCommands) {
      expect(command).not.toContain('CLAUDE_PROJECT_DIR');
    }
  });
});

describe('.claude/settings.json — no hook registrations (single source of truth)', () => {
  const SETTINGS_PATH = path.resolve(__dirname, '..', '..', '..', '..', '.claude', 'settings.json');

  function loadSettings(): Record<string, unknown> {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    return JSON.parse(raw) as Record<string, unknown>;
  }

  it('contains no `hooks` key — plugin manifest is the only registration source', () => {
    expect(loadSettings().hooks).toBeUndefined();
  });

  it('still defines permissions and enabledPlugins', () => {
    const settings = loadSettings();
    expect(settings.permissions).toBeDefined();
    expect(settings.enabledPlugins).toBeDefined();
  });
});
