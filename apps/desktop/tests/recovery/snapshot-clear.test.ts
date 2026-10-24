/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { SNAPSHOT_TIMING } from '../../src/recovery/recovery.constants';
import { createArtwork } from '../files/file-harness';
import { paintAt, rig } from './recovery-harness';
import type { Rig } from './recovery-harness';

const { pauseMs, minGapMs } = SNAPSHOT_TIMING;

const writtenDocument = async (current: Rig): Promise<DocumentId> => {
  current.tracker.start();
  const documentId = createArtwork(current.host);
  paintAt(current.host, documentId, 1);
  await current.advance(pauseMs);
  return documentId;
};

describe('recovery snapshot clearing', () => {
  it('clears the snapshot when the document is saved', async () => {
    const current = rig();
    const { host, stored, calls, cleaned, advance } = current;
    const documentId = await writtenDocument(current);
    expect(stored.has(documentId)).toBe(true);
    host.markSaved(documentId);
    await advance(0);
    expect(stored.has(documentId)).toBe(false);
    expect(calls.at(-1)).toMatchObject({ kind: 'discard', key: documentId });
    expect(cleaned).toContain(documentId);
  });

  it('cancels a snapshot that was still waiting when the document is saved', async () => {
    const { host, tracker, calls, pending, advance } = rig();
    tracker.start();
    const documentId = createArtwork(host);
    paintAt(host, documentId, 1);
    host.markSaved(documentId);
    expect(pending()).toHaveLength(0);
    await advance(minGapMs * 2);
    expect(calls).toEqual([]);
  });

  it('writes again after a save when the document changes again', async () => {
    const current = rig();
    const { host, stored, advance } = current;
    const documentId = await writtenDocument(current);
    host.markSaved(documentId);
    await advance(0);
    paintAt(host, documentId, 2);
    await advance(minGapMs);
    expect(stored.has(documentId)).toBe(true);
  });
});

describe('recovery snapshot discarding', () => {
  it('clears the snapshot when the document is discarded by closing it', async () => {
    const current = rig();
    const { host, stored, advance } = current;
    const documentId = await writtenDocument(current);
    host.close(documentId);
    await advance(0);
    expect(stored.has(documentId)).toBe(false);
  });

  it('does not touch the store for a document that never had a snapshot', async () => {
    const { host, tracker, calls, advance } = rig();
    tracker.start();
    const documentId = createArtwork(host);
    host.markSaved(documentId);
    host.close(documentId);
    await advance(minGapMs);
    expect(calls).toEqual([]);
  });

  it('keeps the snapshot of an unsaved document that is still open', async () => {
    const { host, tracker, stored, advance } = rig();
    tracker.start();
    const first = createArtwork(host);
    const second = createArtwork(host);
    paintAt(host, first, 1);
    paintAt(host, second, 1);
    await advance(pauseMs);
    host.markSaved(first);
    await advance(0);
    expect(stored.has(first)).toBe(false);
    expect(stored.has(second)).toBe(true);
  });

  it('stops watching after stop', async () => {
    const { host, tracker, calls, advance } = rig();
    tracker.start();
    const documentId = createArtwork(host);
    paintAt(host, documentId, 1);
    tracker.stop();
    paintAt(host, documentId, 2);
    await advance(minGapMs);
    expect(calls).toEqual([]);
  });
});
