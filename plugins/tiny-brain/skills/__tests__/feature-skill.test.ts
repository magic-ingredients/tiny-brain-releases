import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

/**
 * stable-uuid-identity F8 Task 2 — the `/feature` skill must delegate creation
 * to `tb work add feature` + `tb work add task` instead of hand-authoring the
 * feature markdown and its `number:` frontmatter. The
 * `task-{featureNumber}-{taskIndex}` derivation rule the skill currently teaches
 * is obsolete under the UUID identity model: the matching key is the task
 * description (resolved to a UUID at hook time), not a position-derived id.
 *
 * Content checks, not behavioural — the skill is markdown read by the harness.
 * Pin the canonical creation path + the absence of the obsolete derivation rule
 * so a regression that re-teaches hand-authored markdown fails pointing at the
 * right phrase.
 */
describe('feature skill — delegates feature/task creation to `tb work add`', () => {
  const skillPath = path.resolve(__dirname, '..', 'feature', 'SKILL.md');
  let content = '';

  beforeAll(async () => {
    content = await fs.readFile(skillPath, 'utf-8');
  });

  it('teaches the `tb work add feature` and `tb work add task` creation commands', () => {
    expect(content).toMatch(/tb work add feature/);
    expect(content).toMatch(/tb work add task/);
  });

  it('drops the obsolete `task-{featureNumber}-{taskIndex}` derivation rule', () => {
    expect(content).not.toMatch(/task-\{featureNumber\}/);
    expect(content).not.toMatch(/task-\{number\}-\{n\}/);
    // The renumbering/ordering rules tied to the positional id are gone too —
    // `number` is assigned by the CLI, never hand-set.
    expect(content).not.toMatch(/Feature Numbering/i);
  });

  it('does not instruct the model to author raw id:/number: frontmatter by hand', () => {
    expect(content).not.toMatch(/id:\s*feature-kebab-case-id/);
    expect(content).not.toMatch(/number:\s*N\b/);
  });

  it('pins the --prd asymmetry: required on `feature`, disambiguation-only on `task`', () => {
    // The asymmetry that bit the sibling /plan skill: `tb work add feature`
    // genuinely REQUIRES --prd (handler usage line), while `tb work add task`
    // resolves the parent on its own and treats --prd as a disambiguation
    // escape hatch. Pin both forms so a regression that drops --prd from
    // feature creation OR re-adds it as required on task creation fails.
    expect(content).toMatch(/tb work add feature --prd <prd-slug>/);
    expect(content).toMatch(/tb work add task --feature/);
    expect(content).toMatch(/--prd[\s\S]{0,80}?(optional|disambiguat|ambiguous)/i);
  });
});
