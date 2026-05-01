import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const SCRIPT_PATH = path.resolve(__dirname, '..', 'adversarial-review.sh');

const PIPELINE_OBJECT_ARRAY = JSON.stringify([
  { type: 'typescript', agent: 'tiny-brain:analyzer-agent', hook: 'pre-commit' },
  { type: 'eslint', agent: 'tiny-brain:analyzer-agent', hook: 'pre-commit' },
  { type: 'coverage', agent: 'tiny-brain:analyzer-agent', hook: 'pre-commit', runsTests: true },
  { type: 'adversarial', agent: 'tiny-brain:adversarial-reviewer' },
  { type: 'mutation', agent: 'tiny-brain:analyzer-agent' },
]);

const PIPELINE_NO_HOOKS = JSON.stringify([
  { type: 'security', agent: 'tiny-brain:security-reviewer' },
  { type: 'adversarial', agent: 'tiny-brain:adversarial-reviewer' },
]);

function setupGitRepo(tmpDir: string): void {
  execSync('git init', { cwd: tmpDir, encoding: 'utf-8' });
  execSync('git config user.email "test@test.com"', { cwd: tmpDir, encoding: 'utf-8' });
  execSync('git config user.name "Test"', { cwd: tmpDir, encoding: 'utf-8' });
  fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(tmpDir, 'src', 'index.ts'), 'export const foo = 1;\nexport const bar = 2;\nexport const baz = 3;\nexport const qux = 4;\n');
  execSync('git add .', { cwd: tmpDir, encoding: 'utf-8' });
  execSync('git commit -m "initial"', { cwd: tmpDir, encoding: 'utf-8' });
  fs.writeFileSync(path.join(tmpDir, 'src', 'index.ts'), 'export const foo = 42;\nexport const bar = 99;\nexport const baz = 100;\nexport const qux = 200;\nexport const extra = 5;\n');
  execSync('git add .', { cwd: tmpDir, encoding: 'utf-8' });
  execSync('git commit -m "feat(core): implement feature"', { cwd: tmpDir, encoding: 'utf-8' });
}

function makeFakeCli(binDir: string, pipelineJson: string): void {
  const fakeNpx = path.join(binDir, 'npx');
  fs.writeFileSync(
    fakeNpx,
    `#!/bin/bash
if [[ "$1" == "tiny-brain" && "$2" == "config" && "$3" == "preferences" && "$4" == "get" && "$5" == "reviewPipeline" ]]; then
  echo 'reviewPipeline: ${pipelineJson.replace(/'/g, "'\\''")}'
  exit 0
fi
exit 1
`,
  );
  fs.chmodSync(fakeNpx, '755');
}

function runHook(opts: {
  cwd: string;
  fakeBinDir: string;
  stdin?: string;
  pathOverride?: string;
}): { stdout: string; stderr: string; exitCode: number } {
  const stdinInput = opts.stdin ?? '{"tool_input":{"command":"git commit -m \\"feat: test\\""}}';
  try {
    const stdout = execSync(
      `echo '${stdinInput}' | bash "${SCRIPT_PATH}"`,
      {
        cwd: opts.cwd,
        encoding: 'utf-8',
        env: {
          ...process.env,
          PATH: opts.pathOverride ?? `${opts.fakeBinDir}:${process.env['PATH'] ?? ''}`,
          HOME: os.homedir(),
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    );
    return { stdout, stderr: '', exitCode: 0 };
  } catch (err: unknown) {
    if (err instanceof Error && 'stdout' in err) {
      const e = err as NodeJS.ErrnoException & { stdout: string; stderr: string; status: number };
      return { stdout: e.stdout, stderr: e.stderr, exitCode: e.status ?? 1 };
    }
    return { stdout: '', stderr: String(err), exitCode: 1 };
  }
}

describe('adversarial-review.sh pipeline parser', () => {
  let tmpDir: string;
  let fakeBinDir: string;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adv-review-test-'));
    fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adv-review-bin-'));
    setupGitRepo(tmpDir);
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(fakeBinDir, { recursive: true, force: true });
  });

  it('resolves first non-hook review type from PipelineStep[] config', () => {
    makeFakeCli(fakeBinDir, PIPELINE_OBJECT_ARRAY);
    const { stdout } = runHook({ cwd: tmpDir, fakeBinDir });
    const parsed = JSON.parse(stdout);
    const ctx: string = parsed.hookSpecificOutput.additionalContext;

    expect(ctx).toContain('tiny-brain:adversarial-reviewer');
    expect(ctx).not.toContain('{type:');
    expect(ctx).not.toContain('typescript-reviewer');
  });

  it('resolves first review type when no hook steps are present', () => {
    makeFakeCli(fakeBinDir, PIPELINE_NO_HOOKS);
    const { stdout } = runHook({ cwd: tmpDir, fakeBinDir });
    const parsed = JSON.parse(stdout);
    const ctx: string = parsed.hookSpecificOutput.additionalContext;

    expect(ctx).toContain('tiny-brain:security-reviewer');
    expect(ctx).toMatch(/--agent security/);
  });

  it('falls back to adversarial when reviewPipeline is empty', () => {
    makeFakeCli(fakeBinDir, '[]');
    const { stdout } = runHook({ cwd: tmpDir, fakeBinDir });
    const parsed = JSON.parse(stdout);
    const ctx: string = parsed.hookSpecificOutput.additionalContext;

    expect(ctx).toContain('tiny-brain:adversarial-reviewer');
  });

  it('falls back to adversarial when config command fails', () => {
    const failBinDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adv-review-fail-'));
    const fakeNpx = path.join(failBinDir, 'npx');
    fs.writeFileSync(fakeNpx, '#!/bin/bash\nexit 1\n');
    fs.chmodSync(fakeNpx, '755');

    try {
      const { stdout } = runHook({ cwd: tmpDir, fakeBinDir: failBinDir });
      const parsed = JSON.parse(stdout);
      const ctx: string = parsed.hookSpecificOutput.additionalContext;

      expect(ctx).toContain('tiny-brain:adversarial-reviewer');
    } finally {
      fs.rmSync(failBinDir, { recursive: true, force: true });
    }
  });

  it('emitted pipeline command contains --agent with clean type name', () => {
    makeFakeCli(fakeBinDir, PIPELINE_OBJECT_ARRAY);
    const { stdout } = runHook({ cwd: tmpDir, fakeBinDir });
    const parsed = JSON.parse(stdout);
    const ctx: string = parsed.hookSpecificOutput.additionalContext;

    expect(ctx).toMatch(/--agent adversarial/);
    expect(ctx).not.toMatch(/--agent \{/);
  });

  // jq-missing fallback is not testable in isolation — the hook uses jq for
  // its own JSON output (line 163), so removing jq from PATH breaks the entire
  // hook, not just the parser. The `command -v jq` guard in the parser is a
  // defense-in-depth measure; the hook already requires jq as a hard dependency.
});
