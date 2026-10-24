/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { FlagOp } from './tilemap.type';

const beforeTurn = (op: FlagOp, size: number, at: Point): Point => {
  if (op === 'flipX') return { x: size - 1 - at.x, y: at.y };
  if (op === 'flipY') return { x: at.x, y: size - 1 - at.y };
  return { x: at.y, y: size - 1 - at.x };
};

export { beforeTurn };
