/* @layer renderer-app @kind test */
import { decodeProject } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { SNAPSHOT_TIMING } from '../../src/recovery/recovery.constants';
import { createProject } from '../files/file-harness';
import { paintAt, rig } from './recovery-harness';

const { pauseMs, minGapMs } = SNAPSHOT_TIMING;

describe('recovery snapshot timing', () => {
  it('writes nothing while a document is clean', async () => {
    const { host, tracker, calls, advance } = rig();
    tracker.start();
    createProject(host);
    await advance(minGapMs * 4);
    expect(calls).toEqual([]);
  });

  it('writes one snapshot after a pause, not one per stroke', async () => {
    const { host, tracker, calls, advance } = rig();
    tracker.start();
    const documentId = createProject(host);
    for (let x = 0; x < 20; x += 1) {
      paintAt(host, documentId, x);
      await advance(50);
    }
    expect(calls).toEqual([]);
    await advance(pauseMs);
    expect(calls.filter((call) => call.kind === 'snapshot')).toHaveLength(1);
  });

  it('stores the current project under the document key with its name', async () => {
    const { host, tracker, stored, advance } = rig();
    tracker.start();
    const documentId = createProject(host);
    paintAt(host, documentId, 3);
    await advance(pauseMs);
    const kept = stored.get(documentId);
    expect(kept?.meta).toEqual({ name: `${documentId}.bxel` });
    const report = decodeProject(kept?.data ?? new Uint8Array());
    expect(report.outcome).toBe('ok');
    expect(report.project).toEqual(host.view(documentId)?.state.project);
  });

});

describe('recovery snapshot spacing', () => {
  it('keeps at least the minimum gap between two snapshots of one document', async () => {
    const { host, tracker, calls, advance, now } = rig();
    tracker.start();
    const documentId = createProject(host);
    paintAt(host, documentId, 1);
    await advance(pauseMs);
    const first = now();
    paintAt(host, documentId, 2);
    await advance(pauseMs);
    expect(calls.filter((call) => call.kind === 'snapshot')).toHaveLength(1);
    await advance(minGapMs);
    const times = calls.filter((call) => call.kind === 'snapshot').map((call) => call.at);
    expect(times).toHaveLength(2);
    expect((times[1] ?? 0) - first).toBeGreaterThanOrEqual(minGapMs);
  });

  it('writes the latest state when the timer fires during steady editing', async () => {
    const { host, tracker, stored, advance } = rig();
    tracker.start();
    const documentId = createProject(host);
    paintAt(host, documentId, 1);
    paintAt(host, documentId, 2);
    paintAt(host, documentId, 3);
    await advance(pauseMs);
    const report = decodeProject(stored.get(documentId)?.data ?? new Uint8Array());
    expect(report.project).toEqual(host.view(documentId)?.state.project);
  });

  it('flushes at once and cancels the pending timer', async () => {
    const { host, tracker, calls, pending, advance } = rig();
    tracker.start();
    const documentId = createProject(host);
    paintAt(host, documentId, 1);
    expect(pending()).toHaveLength(1);
    await tracker.flush();
    expect(pending()).toHaveLength(0);
    expect(calls.filter((call) => call.kind === 'snapshot')).toHaveLength(1);
    await advance(minGapMs * 2);
    expect(calls.filter((call) => call.kind === 'snapshot')).toHaveLength(1);
  });

  it('survives a failing write and tries again at the next edit', async () => {
    const { host, tracker, calls, failure, advance } = rig();
    tracker.start();
    const documentId = createProject(host);
    failure.failing = true;
    paintAt(host, documentId, 1);
    await advance(pauseMs);
    expect(calls).toEqual([]);
    failure.failing = false;
    paintAt(host, documentId, 2);
    await advance(pauseMs);
    expect(calls.filter((call) => call.kind === 'snapshot')).toHaveLength(1);
  });
});
