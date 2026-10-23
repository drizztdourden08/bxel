/* @layer core @kind types */
import type { DocumentId } from '../model/ids.type';
import type { TargetScope } from '../scope/target-scope.type';

type CommandName = string;
type TransactionMode = 'preview' | 'commit';
type TransactionOrigin = 'ui' | 'mcp';

type CommandStep = {
  readonly name: CommandName;
  readonly targets: TargetScope | null;
  readonly options: unknown;
  readonly ref?: string;
};

type TransactionRequest = {
  readonly documentId: DocumentId;
  readonly baseRevision: number;
  readonly mode: TransactionMode;
  readonly origin: TransactionOrigin;
  readonly label: string;
  readonly steps: readonly CommandStep[];
  readonly previewPixels: number;
};

type HistoryRequest = {
  readonly documentId: DocumentId;
  readonly expectedRevision: number;
};

export type { CommandName, CommandStep, HistoryRequest, TransactionMode, TransactionOrigin, TransactionRequest };
