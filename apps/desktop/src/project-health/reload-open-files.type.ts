/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';

interface Held {
  readonly documentId: DocumentId;
  readonly path: string;
}

export type { Held };
