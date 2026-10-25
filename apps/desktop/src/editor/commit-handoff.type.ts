/* @layer renderer-app @kind types */
import type { DocumentId, FrameId, SpriteId } from '@bxel/document';
import type { Rect } from '@bxel/raster';

interface CommitHandoff {
  image: ImageData;
  documentId: DocumentId;
  spriteId: SpriteId;
  frameId: FrameId;
  from: number;
  to: number;
  rect: Rect;
}

interface HandoffSlot {
  current: CommitHandoff | null;
}

export type { CommitHandoff, HandoffSlot };
