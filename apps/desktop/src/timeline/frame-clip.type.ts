/* @layer renderer-app @kind types */
import type { AnimFrameId, AnimationId, DocumentId, Point, Pivot2, Rect, SpriteId } from '@bxel/document';

interface ClipFrame {
  id: AnimFrameId;
  spriteId: SpriteId | null;
  owned: boolean;
  clip: Rect | null;
  durationMs: number;
  offset: Point;
  pivot: Pivot2 | null;
}

interface FrameClip {
  documentId: DocumentId;
  animationId: AnimationId;
  frames: readonly ClipFrame[];
  cut: boolean;
}

export type { ClipFrame, FrameClip };
