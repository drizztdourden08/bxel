/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { saveArtwork } from '../../src/files/save-artwork';
import { createArtwork, harness, paintPixels, SAVED } from './file-harness';

const COPY = 'C:\\art\\copy.bxel';

describe('save artwork paths and failures', () => {
  it('asks for a new path on Save As and returns it', async () => {
    const { kit, host, memory, paths } = harness();
    const documentId = createArtwork(host);
    memory.picks.saveAs = SAVED;
    await saveArtwork(kit, documentId, false);
    memory.picks.saveAs = COPY;
    const outcome = await saveArtwork(kit, documentId, true);
    expect(outcome).toEqual({ kind: 'done', path: COPY, notice: null });
    expect(paths.get(documentId)).toBe(COPY);
  });

  it('reports a cancelled dialog and leaves the document unsaved', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    paintPixels(host, documentId);
    memory.picks.saveAs = null;
    expect(await saveArtwork(kit, documentId, false)).toEqual({ kind: 'cancelled' });
    expect(host.view(documentId)?.clean).toBe(false);
    expect(memory.writes).toEqual([]);
  });

  it('fails with the contract wording and stays unsaved when the write fails', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    paintPixels(host, documentId);
    memory.picks.saveAs = SAVED;
    memory.failWrites = true;
    const outcome = await saveArtwork(kit, documentId, false);
    expect(outcome).toEqual({
      kind: 'failed',
      message: 'Could not save hero.bxel. Your last saved file is unchanged.',
    });
    expect(host.view(documentId)?.clean).toBe(false);
  });
});
