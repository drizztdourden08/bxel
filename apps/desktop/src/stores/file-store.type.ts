/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { FileBusy } from '../files/files.type';

interface FileState {
  paths: Readonly<Record<string, string>>;
  recovered: Readonly<Record<string, true>>;
  busy: FileBusy | null;
  remember: (documentId: DocumentId, path: string) => void;
  markRecovered: (documentId: DocumentId) => void;
  clearRecovered: (documentId: DocumentId) => void;
  setBusy: (busy: FileBusy | null) => void;
}

export type { FileState };
