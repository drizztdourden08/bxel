/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import type { Frame } from '../../model/sprite.type';
import type { TargetIssue } from '../command-error.type';

const frameIssue = (spriteId: SpriteId, frame: Frame, reason: string): TargetIssue => ({
  spriteId,
  layerId: null,
  frameId: frame.id,
  reason,
});

export { frameIssue };
