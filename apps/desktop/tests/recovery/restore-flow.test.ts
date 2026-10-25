/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import type { RecoveredSnapshot } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { recoverSnapshot } from '../../src/recovery/recover-snapshot';
import { SNAPSHOT_TIMING } from '../../src/recovery/recovery.constants';
import type { RecoverOps } from '../../src/recovery/recovery.type';
import { restoreRecovered } from '../../src/recovery/restore-recovered';
import { createArtwork } from '../files/file-harness';
import { paintAt, rig } from './recovery-harness';
import type { Rig } from './recovery-harness';

const OLD_KEY = 'doc_previous';
const ORIGINAL = 'C:\\art\\hero.bxel';

const crashedSession = async (path: string | undefined): Promise<RecoveredSnapshot> => {
  const session = rig();
  session.tracker.start();
  const documentId = createArtwork(session.host);
  paintAt(session.host, documentId, 4);
  await session.advance(SNAPSHOT_TIMING.pauseMs);
  const kept = session.stored.get(documentId);
  if (!kept) throw new Error('the session wrote no snapshot');
  const base = { key: OLD_KEY, name: 'hero.bxel', savedAt: 1, size: kept.data.byteLength };
  return { snapshot: { ...base, path: path ?? null }, bytes: kept.data };
};

type Reopened = {
  readonly session: Rig;
  readonly paths: Map<string, string>;
  readonly recovered: Set<string>;
  readonly ops: (recovered: RecoveredSnapshot | null) => RecoverOps;
  readonly discarded: string[];
};

const reopened = (): Reopened => {
  const session = rig();
  session.tracker.start();
  const paths = new Map<string, string>();
  const recovered = new Set<string>();
  const discarded: string[] = [];
  const kit = {
    host: session.host,
    remember: (documentId: DocumentId, path: string) => {
      paths.set(documentId, path);
    },
    markRecovered: (documentId: DocumentId) => {
      recovered.add(documentId);
    },
    flush: (documentId: DocumentId) => session.tracker.flush(documentId),
    project: () => Promise.resolve(null),
  };
  const ops = (found: RecoveredSnapshot | null): RecoverOps => ({
    restore: () => Promise.resolve(found),
    discard: (key) => {
      discarded.push(key);
      return Promise.resolve();
    },
    kit,
  });
  return { session, paths, recovered, ops, discarded };
};

describe('restoring a recovery snapshot', () => {
  it('opens the snapshot as an unsaved document with the saved content', async () => {
    const found = await crashedSession(ORIGINAL);
    const { session, paths, recovered, ops } = reopened();
    const failure = await recoverSnapshot(OLD_KEY, ops(found));
    expect(failure).toBeNull();
    const [documentId] = session.host.list();
    const view = documentId === undefined ? null : session.host.view(documentId);
    expect(view?.clean).toBe(false);
    expect(view?.canUndo).toBe(false);
    expect(view?.state.readOnly).toBe(false);
    expect(view?.state.artwork.sprites).toHaveLength(1);
    expect(paths.get(documentId ?? '')).toBe(ORIGINAL);
    expect(recovered.has(documentId ?? '')).toBe(true);
  });

  it('keeps no path for an artwork that was never saved', async () => {
    const found = await crashedSession(undefined);
    const { session, paths, ops } = reopened();
    await recoverSnapshot(OLD_KEY, ops(found));
    expect(session.host.list()).toHaveLength(1);
    expect(paths.size).toBe(0);
  });

  it('writes a fresh snapshot for the restored document before the old one is discarded', async () => {
    const found = await crashedSession(ORIGINAL);
    const { session, ops, discarded } = reopened();
    await recoverSnapshot(OLD_KEY, ops(found));
    const [documentId] = session.host.list();
    expect(session.stored.has(documentId ?? '')).toBe(true);
    expect(session.calls[0]).toMatchObject({ kind: 'snapshot', key: documentId });
    expect(discarded).toEqual([OLD_KEY]);
  });

});

describe('restoring after the first open', () => {
  it('stays unsaved until it is saved, then drops its recovery state', async () => {
    const found = await crashedSession(ORIGINAL);
    const { session, ops } = reopened();
    await recoverSnapshot(OLD_KEY, ops(found));
    const [documentId] = session.host.list();
    if (documentId === undefined) throw new Error('nothing was restored');
    await session.advance(SNAPSHOT_TIMING.minGapMs * 2);
    expect(session.host.view(documentId)?.clean).toBe(false);
    session.host.markSaved(documentId);
    await session.advance(0);
    expect(session.host.view(documentId)?.clean).toBe(true);
    expect(session.stored.has(documentId)).toBe(false);
    expect(session.cleaned).toContain(documentId);
  });

  it('reports a copy that cannot be read and keeps the old snapshot', async () => {
    const { session, ops, discarded } = reopened();
    const found: RecoveredSnapshot = {
      snapshot: { key: OLD_KEY, name: 'hero.bxel', path: null, savedAt: 1, size: 4 },
      bytes: new Uint8Array([1, 2, 3, 4]),
    };
    const failure = await recoverSnapshot(OLD_KEY, ops(found));
    expect(failure).toContain('Could not restore the recovered copy.');
    expect(session.host.list()).toEqual([]);
    expect(discarded).toEqual([]);
  });

  it('reports a snapshot that is gone', async () => {
    const { ops, discarded } = reopened();
    expect(await recoverSnapshot(OLD_KEY, ops(null))).toBe('The recovered copy could not be read.');
    expect(discarded).toEqual([]);
  });

  it('restoreRecovered returns the id of the new document', async () => {
    const found = await crashedSession(undefined);
    const { session, ops } = reopened();
    const documentId = await restoreRecovered(ops(found).kit, { path: null, bytes: found.bytes });
    expect(session.host.list()).toEqual([documentId]);
  });
});
