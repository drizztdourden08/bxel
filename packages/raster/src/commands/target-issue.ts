/* @layer core @kind logic */
import type { SpriteId, TargetIssue } from '@bxel/document';

const targetIssue = (spriteId: SpriteId, reason: string): TargetIssue => ({
  spriteId,
  layerId: null,
  frameId: null,
  reason,
});

export { targetIssue };
