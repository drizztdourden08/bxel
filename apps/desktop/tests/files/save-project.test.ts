/* @layer renderer-app @kind test */
import { decodeProject } from '@bxel/document/native';
import { decodePng } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { saveProject } from '../../src/files/save-project';
import { createProject, harness, paintPixels, SAVED } from './file-harness';

describe('save project', () => {
  it('acts as Save As the first time and writes a file the decoder reads back', async () => {
    const { kit, host, memory, paths } = harness();
    const documentId = createProject(host);
    paintPixels(host, documentId);
    memory.picks.saveAs = SAVED;
    const outcome = await saveProject(kit, documentId, false);
    expect(outcome).toEqual({ kind: 'done', path: SAVED, notice: null });
    expect(paths.get(documentId)).toBe(SAVED);
    expect(host.view(documentId)?.clean).toBe(true);
    const report = decodeProject(memory.files.get(SAVED) ?? new Uint8Array());
    expect(report.outcome).toBe('ok');
    expect(report.readOnly).toBe(false);
    expect(report.project).toEqual(host.view(documentId)?.state.project);
  });

  it('stores a thumbnail of the first sprite as a PNG preview', async () => {
    const { kit, host, memory } = harness();
    const documentId = createProject(host);
    memory.picks.saveAs = SAVED;
    await saveProject(kit, documentId, false);
    const preview = decodeProject(memory.files.get(SAVED) ?? new Uint8Array()).preview;
    const decoded = decodePng(preview ?? new Uint8Array());
    expect(decoded.ok).toBe(true);
    expect(decoded.ok && decoded.width).toBeGreaterThan(0);
  });

  it('saves to the same path without asking again and marks the document clean', async () => {
    const { kit, host, memory } = harness();
    const documentId = createProject(host);
    memory.picks.saveAs = SAVED;
    await saveProject(kit, documentId, false);
    memory.picks.saveAs = null;
    paintPixels(host, documentId);
    expect(host.view(documentId)?.clean).toBe(false);
    const outcome = await saveProject(kit, documentId, false);
    expect(outcome.kind).toBe('done');
    expect(memory.writes).toEqual([SAVED, SAVED]);
    expect(host.view(documentId)?.clean).toBe(true);
  });

  it('does nothing when the document is clean and already saved', async () => {
    const { kit, host, memory } = harness();
    const documentId = createProject(host);
    memory.picks.saveAs = SAVED;
    await saveProject(kit, documentId, false);
    await saveProject(kit, documentId, false);
    expect(memory.writes).toEqual([SAVED]);
  });
});
