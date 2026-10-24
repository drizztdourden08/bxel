/* @layer renderer-app @kind test */
import { decodePng } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { exportPng } from '../../src/files/export-png';
import { isArtworkPath } from '../../src/files/is-artwork-path';
import { createArtwork, harness, paintPixels, SAVED } from './file-harness';

const TARGET = 'C:\\art\\hero.png';

describe('export PNG', () => {
  it('writes the current frame at scale 1 as an RGBA PNG', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    paintPixels(host, documentId);
    memory.picks.saveAs = TARGET;
    const outcome = await exportPng(kit, documentId);
    expect(outcome).toEqual({ kind: 'done', path: TARGET, notice: 'Exported hero.png.' });
    const decoded = decodePng(memory.files.get(TARGET) ?? new Uint8Array());
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect([decoded.width, decoded.height]).toEqual([32, 32]);
    expect(Array.from(decoded.data.slice(0, 8))).toEqual([20, 11, 38, 255, 20, 11, 38, 255]);
  });

  it('does not change the saved state of the artwork', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    paintPixels(host, documentId);
    memory.picks.saveAs = TARGET;
    await exportPng(kit, documentId);
    expect(host.view(documentId)?.clean).toBe(false);
  });

  it('returns cancelled when the dialog is dismissed', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    memory.picks.saveAs = null;
    expect(await exportPng(kit, documentId)).toEqual({ kind: 'cancelled' });
    expect(memory.writes).toEqual([]);
  });

  it('fails with the contract wording when the write fails', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    memory.picks.saveAs = TARGET;
    memory.failWrites = true;
    expect(await exportPng(kit, documentId)).toEqual({
      kind: 'failed',
      message: 'Export failed: The disk is full. No files were changed.',
    });
  });

  it('writes without adding the file to the recent list', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    memory.picks.saveAs = TARGET;
    await exportPng(kit, documentId);
    expect(memory.options).toEqual([{ recent: false }]);
    expect(memory.recent).toEqual([]);
  });

});
