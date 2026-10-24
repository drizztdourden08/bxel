/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { Clock } from '@bxel/document/native';
import type { SnapshotMeta } from '@drizztdourden08/brock-core';
import type { RecoveredSnapshot } from '@drizztdourden08/brock-react';
import type { DocumentHost } from '../documents/document-host.type';

type SnapshotSink = {
  readonly snapshot: (key: string, data: Uint8Array, meta: SnapshotMeta) => Promise<void>;
  readonly discard: (key: string) => Promise<void>;
};

type SnapshotTimers = {
  readonly set: (run: () => void, ms: number) => number;
  readonly clear: (handle: number) => void;
};

type SnapshotTiming = {
  readonly pauseMs: number;
  readonly minGapMs: number;
};

type RecoveryDeps = {
  readonly host: DocumentHost;
  readonly sink: SnapshotSink;
  readonly timers: SnapshotTimers;
  readonly timing: SnapshotTiming;
  readonly clock: Clock;
  readonly now: () => number;
  readonly describe: (documentId: DocumentId) => SnapshotMeta;
  readonly onClean: (documentId: DocumentId) => void;
};

type RecoveryState = {
  readonly timers: Map<DocumentId, number>;
  readonly lastWrite: Map<DocumentId, number>;
  readonly written: Set<DocumentId>;
  readonly queue: Map<DocumentId, Promise<void>>;
  stops: (() => void)[];
};

type RecoveryRun = {
  readonly deps: RecoveryDeps;
  readonly state: RecoveryState;
};

type RecoveryTracker = {
  readonly start: () => void;
  readonly stop: () => void;
  readonly flush: (documentId?: DocumentId) => Promise<void>;
  readonly discard: (documentId: DocumentId) => Promise<void>;
};

type RestoreKit = {
  readonly host: DocumentHost;
  readonly remember: (documentId: DocumentId, path: string) => void;
  readonly markRecovered: (documentId: DocumentId) => void;
  readonly flush: (documentId: DocumentId) => Promise<void>;
};

type RecoverOps = {
  readonly restore: (key: string) => Promise<RecoveredSnapshot | null>;
  readonly discard: (key: string) => Promise<void>;
  readonly kit: RestoreKit;
};

type RecoveredCopy = {
  readonly path: string | null;
  readonly bytes: Uint8Array;
};

type DirtyDocument = {
  readonly documentId: DocumentId;
  readonly name: string;
};

type CloseAnswer = 'save' | 'discard' | 'cancel';

type QuitDeps = {
  readonly dirty: () => readonly DirtyDocument[];
  readonly flush: () => Promise<void>;
  readonly ask: (name: string) => Promise<CloseAnswer>;
  readonly save: (documentId: DocumentId) => Promise<boolean>;
  readonly discard: (documentId: DocumentId) => Promise<void>;
};

export type {
  CloseAnswer,
  DirtyDocument,
  QuitDeps,
  RecoverOps,
  RecoveredCopy,
  RecoveryDeps,
  RecoveryRun,
  RecoveryState,
  RecoveryTracker,
  RestoreKit,
  SnapshotSink,
  SnapshotTimers,
  SnapshotTiming,
};
