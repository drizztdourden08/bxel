/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { openArtwork } from '../../src/files/open-artwork';
import { saveArtwork } from '../../src/files/save-artwork';
import { damageCel } from './damage-cel';
import { createArtwork, harness, paintPixels, SAVED } from './file-harness';

const DAMAGED = 'C:\\art\\damaged.bxel';

describe('open artwork with damage', () => {
  it('opens a damaged file read-only with the notice from the report', async () => {
    const { kit, host, memory } = harness();
    const source = createArtwork(host);
    paintPixels(host, source);
    memory.picks.saveAs = SAVED;
    await saveArtwork(kit, source, false);
    memory.files.set(DAMAGED, damageCel(memory.files.get(SAVED) ?? new Uint8Array()));
    const outcome = await openArtwork(kit, DAMAGED);
    expect(outcome.kind).toBe('done');
    expect(outcome.kind === 'done' && outcome.notice).toEqual(expect.any(String));
    const opened = host.list().find((id) => id !== source);
    expect(opened ? host.view(opened)?.state.readOnly : null).toBe(true);
  });

  it('shows the error text and opens nothing when the file is fatal', async () => {
    const { kit, host, memory } = harness();
    memory.files.set('C:\\art\\notes.bxel', new Uint8Array([1, 2, 3, 4]));
    const outcome = await openArtwork(kit, 'C:\\art\\notes.bxel');
    expect(outcome.kind).toBe('failed');
    expect(outcome.kind === 'failed' && outcome.message.startsWith('Could not open notes.bxel. ')).toBe(true);
    expect(host.list()).toEqual([]);
  });

  it('fails with the reason when the file cannot be read', async () => {
    const { kit, host } = harness();
    const outcome = await openArtwork(kit, 'C:\\art\\missing.bxel');
    expect(outcome).toEqual({ kind: 'failed', message: 'Could not open missing.bxel. No file at C:\\art\\missing.bxel' });
    expect(host.list()).toEqual([]);
  });
});
