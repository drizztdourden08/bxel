/* @layer renderer-app @kind test */
import { decodeArtwork } from '@bxel/document/native';
import { decodePng } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { saveArtwork } from '../../src/files/save-artwork';
import { createArtwork, harness, paintPixels, SAVED } from './file-harness';

describe('save artwork', () => {
  it('acts as Save As the first time and writes a file the decoder reads back', async () => {
    const { kit, host, memory, paths } = harness();
    const documentId = createArtwork(host);
    paintPixels(host, documentId);
    memory.picks.saveAs = SAVED;
    const outcome = await saveArtwork(kit, documentId, false);
    expect(outcome).toEqual({ kind: 'done', path: SAVED, notice: null });
    expect(paths.get(documentId)).toBe(SAVED);
    expect(host.view(documentId)?.clean).toBe(true);
    const report = decodeArtwork(memory.files.get(SAVED) ?? new Uint8Array());
    expect(report.outcome).toBe('ok');
    expect(report.readOnly).toBe(false);
    expect(report.artwork).toEqual(host.view(documentId)?.state.artwork);
  });

  it('stores a thumbnail of the first sprite as a PNG preview', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    memory.picks.saveAs = SAVED;
    await saveArtwork(kit, documentId, false);
    const preview = decodeArtwork(memory.files.get(SAVED) ?? new Uint8Array()).preview;
    const decoded = decodePng(preview ?? new Uint8Array());
    expect(decoded.ok).toBe(true);
    expect(decoded.ok && decoded.width).toBeGreaterThan(0);
  });

  it('saves to the same path without asking again and marks the document clean', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    memory.picks.saveAs = SAVED;
    await saveArtwork(kit, documentId, false);
    memory.picks.saveAs = null;
    paintPixels(host, documentId);
    expect(host.view(documentId)?.clean).toBe(false);
    const outcome = await saveArtwork(kit, documentId, false);
    expect(outcome.kind).toBe('done');
    expect(memory.writes).toEqual([SAVED, SAVED]);
    expect(host.view(documentId)?.clean).toBe(true);
  });

  it('does nothing when the document is clean and already saved', async () => {
    const { kit, host, memory } = harness();
    const documentId = createArtwork(host);
    memory.picks.saveAs = SAVED;
    await saveArtwork(kit, documentId, false);
    await saveArtwork(kit, documentId, false);
    expect(memory.writes).toEqual([SAVED]);
  });
});
