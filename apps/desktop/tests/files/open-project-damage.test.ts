/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { openProject } from '../../src/files/open-project';
import { saveProject } from '../../src/files/save-project';
import { damageCel } from './damage-cel';
import { createProject, harness, paintPixels, SAVED } from './file-harness';

const DAMAGED = 'C:\\art\\damaged.bxel';

describe('open project with damage', () => {
  it('opens a damaged file read-only with the notice from the report', async () => {
    const { kit, host, memory } = harness();
    const source = createProject(host);
    paintPixels(host, source);
    memory.picks.saveAs = SAVED;
    await saveProject(kit, source, false);
    memory.files.set(DAMAGED, damageCel(memory.files.get(SAVED) ?? new Uint8Array()));
    const outcome = await openProject(kit, DAMAGED);
    expect(outcome.kind).toBe('done');
    expect(outcome.kind === 'done' && outcome.notice).toEqual(expect.any(String));
    const opened = host.list().find((id) => id !== source);
    expect(opened ? host.view(opened)?.state.readOnly : null).toBe(true);
  });

  it('shows the error text and opens nothing when the file is fatal', async () => {
    const { kit, host, memory } = harness();
    memory.files.set('C:\\art\\notes.bxel', new Uint8Array([1, 2, 3, 4]));
    const outcome = await openProject(kit, 'C:\\art\\notes.bxel');
    expect(outcome.kind).toBe('failed');
    expect(outcome.kind === 'failed' && outcome.message.startsWith('Could not open notes.bxel. ')).toBe(true);
    expect(host.list()).toEqual([]);
  });

  it('fails with the reason when the file cannot be read', async () => {
    const { kit, host } = harness();
    const outcome = await openProject(kit, 'C:\\art\\missing.bxel');
    expect(outcome).toEqual({ kind: 'failed', message: 'Could not open missing.bxel. No file at C:\\art\\missing.bxel' });
    expect(host.list()).toEqual([]);
  });
});
