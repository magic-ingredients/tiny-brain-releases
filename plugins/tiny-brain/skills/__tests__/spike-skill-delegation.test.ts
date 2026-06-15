import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

/**
 * stable-uuid-identity F8 Task 4 — the `/spike` skill must delegate doc + task
 * creation to `tb work add spike` + `tb work add task --spike` instead of
 * writing the spike markdown by hand from the template. The CLI generates the
 * spike's `uuid:` and each task block's `uuid:`; humans never type them.
 *
 * Scope note: `tb work add spike` renders the frontmatter shell with PLACEHOLDER
 * question / acceptanceCriteria / timebox, and `tb work add task --spike` does
 * not stamp `pipelineType: spike`. So the skill still Edits in the real values
 * and stamps the pipeline type — this guard pins that the creation commands are
 * taught AND that the spike pipeline type is still documented.
 *
 * Separate from spike-skill.test.ts, which keeps pinning the "Commit-type prefix
 * for spike work" section.
 */
describe('spike skill — delegates spike/task creation to `tb work add`', () => {
  const skillPath = path.resolve(__dirname, '..', 'spike', 'SKILL.md');
  let content = '';

  beforeAll(async () => {
    content = await fs.readFile(skillPath, 'utf-8');
  });

  it('teaches the `tb work add spike` and `tb work add task --spike` creation commands', () => {
    expect(content).toMatch(/tb work add spike/);
    expect(content).toMatch(/tb work add task --spike/);
  });

  it('no longer writes the spike doc by hand from the markdown template', () => {
    // The old flow wrote the doc "from the template at templates/spike-template.md"
    // via the Write tool. Creation now goes through `tb work add spike`.
    expect(content).not.toMatch(/from the template at/);
  });

  it('still documents `pipelineType: spike` (the CLI does not stamp it)', () => {
    // `tb work add task --spike` defaults the task to standard; the skill must
    // still tell the agent to stamp `pipelineType: spike` on each spike task.
    expect(content).toMatch(/pipelineType: spike/);
  });
});
