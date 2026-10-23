/* @layer core @kind types */
import type { DocumentJson } from './document-json.type';

type ReadDocument = {
  readonly document: DocumentJson;
  readonly blobs: ReadonlyMap<string, Uint8Array>;
  readonly migrated: boolean;
};

export type { ReadDocument };
