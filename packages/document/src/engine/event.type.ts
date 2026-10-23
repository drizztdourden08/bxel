/* @layer core @kind types */
import type { ChangeSet } from '../commands/result.type';
import type { TransactionOrigin } from '../commands/transaction.type';
import type { DocumentId } from '../model/ids.type';

type DocumentEventKind = 'commit' | 'undo' | 'redo' | 'open' | 'save';

type DocumentEvent = {
  readonly kind: DocumentEventKind;
  readonly documentId: DocumentId;
  readonly revision: number;
  readonly previousRevision: number;
  readonly label: string;
  readonly origin: TransactionOrigin;
  readonly changes: ChangeSet;
};

type DocumentListener = (event: DocumentEvent) => void;

export type { DocumentEvent, DocumentEventKind, DocumentListener };
