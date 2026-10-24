/* @layer core @kind types */
import type { CommandDef } from '../commands/command-def.type';
import type { CommandStep, HistoryRequest, TransactionRequest } from '../commands/transaction.type';
import type { TransactionResult } from '../commands/result.type';
import type { Draft } from '../draft/draft.type';
import type { HistoryDirection, HistoryEntry, HistoryLimits, HistoryState } from '../history/history.type';
import type { IdSource } from '../ids/id-source.type';
import type { Clock } from '../native/clock.type';
import type { DocumentId } from '../model/ids.type';
import type { DocumentState, Artwork } from '../model/artwork.type';
import type { DocumentListener } from './event.type';

type EngineOptions = {
  readonly state: DocumentState;
  readonly ids: IdSource;
  readonly clock?: Clock;
  readonly commands: readonly CommandDef[];
  readonly limits?: HistoryLimits;
  readonly unsaved?: boolean;
};

type Engine = {
  readonly documentId: DocumentId;
  readonly state: () => DocumentState;
  readonly execute: (request: TransactionRequest) => TransactionResult;
  readonly undo: (request: HistoryRequest) => TransactionResult;
  readonly redo: (request: HistoryRequest) => TransactionResult;
  readonly subscribe: (listener: DocumentListener) => () => void;
  readonly newest: () => HistoryEntry | null;
  readonly canUndo: () => boolean;
  readonly canRedo: () => boolean;
  readonly isClean: () => boolean;
  readonly markSaved: () => void;
};

type EngineStore = {
  readonly documentId: DocumentId;
  readonly readOnly: boolean;
  readonly registry: ReadonlyMap<string, CommandDef>;
  readonly limits: HistoryLimits;
  readonly listeners: Set<DocumentListener>;
  revision: number;
  artwork: Artwork;
  ids: IdSource;
  clock: Clock | undefined;
  history: HistoryState;
  nextEntryId: number;
};

type DraftRun = {
  readonly store: EngineStore;
  readonly draft: Draft;
  readonly request: TransactionRequest;
};

type StepRun = {
  readonly store: EngineStore;
  readonly draft: Draft;
  readonly step: CommandStep;
  readonly index: number;
};

type HistoryRun = {
  readonly store: EngineStore;
  readonly request: HistoryRequest;
  readonly direction: HistoryDirection;
};

export type { DraftRun, Engine, EngineOptions, EngineStore, HistoryRun, StepRun };
