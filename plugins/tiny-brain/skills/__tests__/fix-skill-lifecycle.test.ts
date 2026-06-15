import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

/**
 * thin-claude-md-defer-to-pipeline T4 — the Fix Status Workflow
 * section was removed from the generated CLAUDE.md. Its content
 * has to land in the fix skill so a model that loads the skill
 * (instead of relying on the now-thinned CLAUDE.md prose) still
 * gets the full lifecycle.
 *
 * These assertions are content checks, not behavioural — the
 * skill is markdown read by the harness, not executed code. We
 * pin the named sections + the load-bearing keywords so a future
 * trim of the skill that drops one of these arms fails pointing
 * at the right phrase.
 */
describe('fix skill — lifecycle coverage parity with the removed CLAUDE.md Fix Status Workflow', () => {
  const skillPath = path.resolve(__dirname, '..', 'fix', 'SKILL.md');
  const hookPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'tiny-brain-core',
    'templates',
    'hooks',
    'post-commit',
  );
  let content = '';
  let hookSource = '';

  beforeAll(async () => {
    content = await fs.readFile(skillPath, 'utf-8');
    hookSource = await fs.readFile(hookPath, 'utf-8');
  });

  it('documents the four status values the workflow uses', () => {
    // These four values are the canonical lifecycle states. A
    // skill that omits any of them leaves a hole in the guidance.
    expect(content).toMatch(/not_started/);
    expect(content).toMatch(/in_progress/);
    expect(content).toMatch(/completed/);
    expect(content).toMatch(/superseded/);
  });

  it('covers the completion ceremony (resolution YAML + task sync), not a status flip', () => {
    // Completion writes the resolution block + resolved timestamp and runs
    // task sync. It does NOT flip frontmatter `status: completed` — status is
    // git-sourced (fix post-commit-reminder-and-fix-skill-instruct-complete-
    // on-green Task 3).
    expect(content).toMatch(/Completing a Fix/i);
    expect(content).toMatch(/resolution:/);
    expect(content).toMatch(/rootCause/);
    expect(content).toMatch(/filesModified/);
    expect(content).toMatch(/tiny-brain (sync-file|task sync)/);
  });

  it('does NOT instruct writing markdown task/fix status (status is git-sourced)', () => {
    // Task 3: the markdown status writers are retired. The skill must not tell
    // the model to flip the task block to completed, set frontmatter
    // status: completed on completion, or flip status: in_progress on resume.
    expect(content).not.toMatch(/flip the task block to `?status: completed`?/i);
    expect(content).not.toMatch(/Set frontmatter `?status: in_progress`?/i);
    expect(content).not.toMatch(/status: completed\s+#\s*Change from in_progress/);
    // The per-commit reminder is gone, so the skill no longer quotes it.
    expect(content).not.toContain("Update task '<task>' in docs/fixes/{fix-id}.md");
  });

  it('instructs writing a per-task detail block under each task heading (dashboard surfaces it per task)', () => {
    // fix fix-skill-authors-per-task-detail: the dashboard's per-task detail
    // panel renders the prose under each `### N.` task heading. tb work add
    // tasks are heading-only, so the skill must tell the author to add a
    // per-task detail block — otherwise the panel is blank.
    expect(content).toMatch(/under (each|its|the) (task )?(`?### ?N\.?`?|task heading)/i);
    expect(content).toMatch(/per-task detail/i);
    // …and the imperative to actually add the block, not just the vocabulary.
    expect(content).toMatch(/(add|write)[^.\n]*\bblock\b[^.\n]*task heading/i);
  });

  it('the post-commit hook no longer emits a per-commit status-update reminder', () => {
    // Cross-surface drift guard: the hook must not instruct editing the task
    // block status (read by nothing — status is git-sourced).
    expect(hookSource).not.toMatch(/Update task '\$TASK_LINE' in \$DOC_PATH/);
    expect(hookSource).not.toMatch(/set 'status: completed'/);
  });
});
