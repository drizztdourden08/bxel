/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { Clock, LoadReport } from '@bxel/document/native';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { DocumentHost } from '../documents/document-host.type';

type PathBook = {
  readonly pathOf: (documentId: DocumentId) => string | undefined;
  readonly documentAt: (path: string) => DocumentId | undefined;
  readonly remember: (documentId: DocumentId, path: string) => void;
};

type FileKit = {
  readonly documents: DocumentsPort;
  readonly host: DocumentHost;
  readonly paths: PathBook;
  readonly clock: Clock;
  readonly focus: (documentId: DocumentId) => void;
};

type FileOutcome =
  | { readonly kind: 'done'; readonly path: string; readonly notice: string | null }
  | { readonly kind: 'cancelled' }
  | { readonly kind: 'failed'; readonly message: string };

type FileAction =
  | { readonly kind: 'save' }
  | { readonly kind: 'saveAs' }
  | { readonly kind: 'open' }
  | { readonly kind: 'openPath'; readonly path: string }
  | { readonly kind: 'export' };

type FileActionKind = FileAction['kind'];

type FileBusy = 'saving' | 'opening' | 'exporting';

type ReadResult = { readonly report: LoadReport } | { readonly message: string };

export type { FileAction, FileActionKind, FileBusy, FileKit, FileOutcome, PathBook, ReadResult };
