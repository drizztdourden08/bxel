/* @layer renderer-app @kind logic */
import type { Size, TileCollision } from '@bxel/document';
import type { CollisionKind } from './collision.type';

const defaultCollision = (kind: CollisionKind, tile: Size): TileCollision | null => {
  if (kind === 'none') return null;
  if (kind === 'full') return { kind: 'full' };
  const { width, height } = tile;
  if (kind === 'rect') return { kind: 'rect', x: 0, y: 0, width, height };
  return {
    kind: 'polygon',
    points: [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
    ],
  };
};

export { defaultCollision };
