/* @layer renderer-app @kind types */
import type {
  CommandDef,
  CommandError,
  DocumentEvent,
  DocumentId,
  DocumentListener,
  DocumentState,
  Engine,
  HistoryEntry,
  HistoryLimits,
  IdSource,
  Artwork,
  TransactionRequest,
  TransactionResult,
} from '@bxel/document';
import type { Clock } from '@bxel/document/native';

type DocumentView = {
  readonly state: DocumentState;
  readonly clean: boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly lastEvent: DocumentEvent;
  readonly newest: HistoryMark | null;
};

type HistoryMark = Pick<HistoryEntry, 'label' | 'origin' | 'actor'>;

type HostChange = {
  readonly kind: 'open' | 'close';
  readonly documentId: DocumentId;
  readonly ids: readonly DocumentId[];
};

type HostChangeListener = (change: HostChange) => void;

type CreateOutcome =
  | { readonly ok: true; readonly documentId: DocumentId }
  | { readonly ok: false; readonly error: CommandError };

type OpenRequest = {
  readonly artwork: Artwork;
  readonly readOnly: boolean;
  readonly unsaved?: boolean;
};

type DocumentHostOptions = {
  readonly ids?: IdSource;
  readonly clock?: Clock;
  readonly commands?: readonly CommandDef[];
  readonly limits?: HistoryLimits;
};

type DocumentHost = {
  readonly create: (options: unknown) => CreateOutcome;
  readonly open: (request: OpenRequest) => DocumentId;
  readonly close: (documentId: DocumentId) => boolean;
  readonly list: () => readonly DocumentId[];
  readonly view: (documentId: DocumentId) => DocumentView | null;
  readonly execute: (request: TransactionRequest) => TransactionResult;
  readonly undo: (documentId: DocumentId) => TransactionResult;
  readonly redo: (documentId: DocumentId) => TransactionResult;
  readonly markSaved: (documentId: DocumentId) => boolean;
  readonly subscribe: (listener: DocumentListener) => () => void;
  readonly watch: (documentId: DocumentId, listener: DocumentListener) => () => void;
  readonly subscribeChanges: (listener: HostChangeListener) => () => void;
};

type HostEntry = {
  readonly engine: Engine;
  readonly stop: () => void;
  view: DocumentView;
};

type HostStore = {
  readonly ids: IdSource;
  readonly clock: Clock | undefined;
  readonly commands: readonly CommandDef[];
  readonly limits: HistoryLimits | undefined;
  readonly entries: Map<DocumentId, HostEntry>;
  readonly listeners: Set<DocumentListener>;
  readonly changeListeners: Set<HostChangeListener>;
};

export type {
  DocumentHost,
  DocumentHostOptions,
  DocumentView,
  HostChange,
  HostEntry,
  HostStore,
};
