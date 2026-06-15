import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

/**
 * stable-uuid-identity F8 Task 3 — the `/fix` skill must delegate creation to
 * `tb work add fix` + `tb work add task --fix` instead of hand-authoring the fix
 * markdown and its `id:` frontmatter. The CLI generates the fix's `uuid:` and
 * each task block's `uuid:`; humans never type them.
 *
 * Scope note: this guard covers only the CREATION path. The fix lifecycle
 * (status values, resume-before-implement ordering, completion ceremony, the
 * verbatim post-commit hook phrase) is pinned separately by
 * fix-skill-lifecycle.test.ts and must stay green through this rewrite.
 *
 * Content checks, not behavioural — the skill is markdown read by the harness.
 */
describe('fix skill — delegates fix/task creation to `tb work add`', () => {
  const skillPath = path.resolve(__dirname, '..', 'fix', 'SKILL.md');
  let content = '';

  beforeAll(async () => {
    content = await fs.readFile(skillPath, 'utf-8');
  });

  it('teaches the `tb work add fix` and `tb work add task --fix` creation commands', () => {
    expect(content).toMatch(/tb work add fix/);
    expect(content).toMatch(/tb work add task --fix/);
  });

  it('drops the hand-authored `id:` / `uuid:` frontmatter guidance', () => {
    // The CLI renders frontmatter with the generated uuid; the skill must not
    // teach a hand-written `id: fix-kebab-case-id` block, nor instruct the
    // model to type a `reported:` timestamp via `new Date().toISOString()`.
    expect(content).not.toMatch(/id:\s*fix-kebab-case-id/);
    expect(content).not.toMatch(/new Date\(\)\.toISOString\(\)/);
  });

  it('explains the slug-vs-UUID model so humans never type a uuid', () => {
    expect(content).toMatch(/uuid/i);
    expect(content).toMatch(/\bslug\b/i);
  });
});
