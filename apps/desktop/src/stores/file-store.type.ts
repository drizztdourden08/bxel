/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { FileBusy } from '../files/files.type';

interface FileState {
  paths: Readonly<Record<string, string>>;
  busy: FileBusy | null;
  remember: (documentId: DocumentId, path: string) => void;
  setBusy: (busy: FileBusy | null) => void;
}

export type { FileState };
