/* @layer renderer-app @kind test */
import { COMMAND_NAME, counterIdSource } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import type { SnapshotMeta } from '@drizztdourden08/brock-core';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { activeTarget } from '../../src/editor/active-target';
import { commitRequest } from '../../src/editor/commit-request';
import { createRecoveryTracker } from '../../src/recovery/create-recovery-tracker';
import { SNAPSHOT_TIMING } from '../../src/recovery/recovery.constants';
import type { RecoveryTracker, SnapshotSink, SnapshotTimers } from '../../src/recovery/recovery.type';

type StoredSnapshot = {
  readonly data: Uint8Array;
  readonly meta: SnapshotMeta;
  readonly at: number;
};

type SinkCall = { readonly kind: 'snapshot' | 'discard'; readonly key: string; readonly at: number };

type PendingTimer = { readonly run: () => void; readonly at: number };

type Clock = { time: number };

type MemorySink = {
  readonly sink: SnapshotSink;
  readonly stored: Map<string, StoredSnapshot>;
  readonly calls: SinkCall[];
  readonly failure: { failing: boolean };
};

type FakeTimers = {
  readonly timers: SnapshotTimers;
  readonly pending: () => number[];
  readonly advance: (ms: number) => Promise<void>;
};

type Rig = {
  readonly host: DocumentHost;
  readonly tracker: RecoveryTracker;
  readonly stored: Map<string, StoredSnapshot>;
  readonly calls: SinkCall[];
  readonly cleaned: DocumentId[];
  readonly failure: { failing: boolean };
  readonly pending: () => number[];
  readonly advance: (ms: number) => Promise<void>;
  readonly now: () => number;
};

const settle = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

const memorySink = (clock: Clock): MemorySink => {
  const stored = new Map<string, StoredSnapshot>();
  const calls: SinkCall[] = [];
  const failure = { failing: false };
  const sink: SnapshotSink = {
    snapshot: (key, data, meta) => {
      if (failure.failing) return Promise.reject(new Error('The disk is full'));
      stored.set(key, { data, meta, at: clock.time });
      calls.push({ kind: 'snapshot', key, at: clock.time });
      return Promise.resolve();
    },
    discard: (key) => {
      stored.delete(key);
      calls.push({ kind: 'discard', key, at: clock.time });
      return Promise.resolve();
    },
  };
  return { sink, stored, calls, failure };
};

const fakeTimers = (clock: Clock): FakeTimers => {
  const timers = new Map<number, PendingTimer>();
  let nextHandle = 1;
  const nextDue = (target: number): [number, PendingTimer] | undefined =>
    [...timers.entries()].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
  const advance = async (ms: number): Promise<void> => {
    const target = clock.time + ms;
    for (let due = nextDue(target); due; due = nextDue(target)) {
      timers.delete(due[0]);
      clock.time = Math.max(clock.time, due[1].at);
      due[1].run();
      await settle();
    }
    clock.time = target;
  };
  return {
    timers: {
      set: (run, ms) => {
        const handle = nextHandle++;
        timers.set(handle, { run, at: clock.time + ms });
        return handle;
      },
      clear: (handle) => {
        timers.delete(handle);
      },
    },
    pending: () => [...timers.values()].map((timer) => timer.at - clock.time),
    advance,
  };
};

const rig = (): Rig => {
  const host = createDocumentHost({ ids: counterIdSource() });
  const clock: Clock = { time: 1_000_000 };
  const cleaned: DocumentId[] = [];
  const memory = memorySink(clock);
  const fake = fakeTimers(clock);
  const tracker = createRecoveryTracker({
    host,
    sink: memory.sink,
    timers: fake.timers,
    timing: SNAPSHOT_TIMING,
    clock: () => clock.time,
    now: () => clock.time,
    describe: (documentId) => ({ name: `${documentId}.bxel` }),
    onClean: (documentId) => {
      cleaned.push(documentId);
    },
  });
  const { stored, calls, failure } = memory;
  return { host, tracker, stored, calls, cleaned, failure, pending: fake.pending, advance: fake.advance, now: () => clock.time };
};

const paintAt = (host: DocumentHost, documentId: DocumentId, x: number): void => {
  const target = activeTarget(host.view(documentId));
  if (!target) throw new Error('the document has no sprite');
  const options = { points: [{ x, y: 0 }], brush: { shape: 'square', size: 1 }, index: 1 };
  const result = host.execute(commitRequest(target, 'Pencil', { name: COMMAND_NAME.pixelsPaint, options }));
  if (!result.ok) throw new Error(result.error.message);
};

export { paintAt, rig };
export type { Rig };
