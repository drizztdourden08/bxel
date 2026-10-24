/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { PresetContext } from './preset-entry.type';

type PresetLive = {
  readonly documentId: DocumentId;
  readonly readOnly: boolean;
  readonly context: PresetContext;
};

export type { PresetLive };
