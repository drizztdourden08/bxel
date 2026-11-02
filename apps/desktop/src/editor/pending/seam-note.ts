/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { PENDING_TEXT, RIGHT_ANGLE } from './pending.constants';
import type { PendingSpec } from './pending.type';

const seamNote = (sprite: Pick<Sprite, 'role'>, spec: PendingSpec): string | null => {
  if (sprite.role !== 'tile' || spec.kind !== 'transform') return null;
  const free = spec.corners !== null || spec.angle % RIGHT_ANGLE !== 0 || spec.skew.x !== 0 || spec.skew.y !== 0;
  return free ? PENDING_TEXT.seams : null;
};

export { seamNote };
