/* @layer renderer-app @kind types */
import type {
  CommandDef,
  CommandError,
  DocumentEvent,
  DocumentId,
  DocumentListener,
  DocumentState,
  Engine,
  HistoryLimits,
  IdSource,
  Project,
  TransactionRequest,
  TransactionResult,
} from '@bxel/document';

type DocumentView = {
  readonly state: DocumentState;
  readonly clean: boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly lastEvent: DocumentEvent;
};

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
  readonly project: Project;
  readonly readOnly: boolean;
};

type DocumentHostOptions = {
  readonly ids?: IdSource;
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
