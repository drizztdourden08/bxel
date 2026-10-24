/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import type { RecoverableSnapshot } from '@drizztdourden08/brock-core';
import type { RecoveredSnapshot } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { recoverSnapshot } from '../../src/recovery/recover-snapshot';
import { SNAPSHOT_TIMING } from '../../src/recovery/recovery.constants';
import { unopenedSnapshots } from '../../src/recovery/unopened-snapshots';
import { createArtwork } from '../files/file-harness';
import { paintAt, rig } from './recovery-harness';

const OLD_KEY = 'doc_previous';

const listed = (key: string): RecoverableSnapshot => ({ key, name: `${key}.bxel`, path: null, savedAt: 1, size: 1 });

describe('the snapshots that are still waiting to be restored', () => {
  it('drops a snapshot whose key is an open document', () => {
    const snapshots = [listed('a'), listed('b'), listed('c')];
    expect(unopenedSnapshots(snapshots, ['b']).map((snapshot) => snapshot.key)).toEqual(['a', 'c']);
  });

  it('keeps every snapshot when no document is open', () => {
    const snapshots = [listed('a'), listed('b')];
    expect(unopenedSnapshots(snapshots, [])).toEqual(snapshots);
  });

  it('leaves nothing pending once the restored copy is open, so the dialog closes', async () => {
    const crashed = rig();
    crashed.tracker.start();
    const crashedId = createArtwork(crashed.host);
    paintAt(crashed.host, crashedId, 4);
    await crashed.advance(SNAPSHOT_TIMING.pauseMs);
    const kept = crashed.stored.get(crashedId);
    if (!kept) throw new Error('the session wrote no snapshot');
    const found: RecoveredSnapshot = { snapshot: { ...listed(OLD_KEY), size: kept.data.byteLength }, bytes: kept.data };

    const session = rig();
    session.tracker.start();
    const kit = {
      host: session.host,
      remember: () => undefined,
      markRecovered: () => undefined,
      flush: (documentId: DocumentId) => session.tracker.flush(documentId),
    };
    const failure = await recoverSnapshot(OLD_KEY, {
      restore: () => Promise.resolve(found),
      discard: () => Promise.resolve(),
      kit,
    });
    expect(failure).toBeNull();

    const stillListed = [...session.stored.keys()].map(listed);
    expect(stillListed.length).toBeGreaterThan(0);
    expect(unopenedSnapshots(stillListed, session.host.list())).toEqual([]);
  });
});
