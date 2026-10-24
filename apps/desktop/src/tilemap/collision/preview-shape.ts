/* @layer renderer-app @kind logic */
import type { TileCollision } from '@bxel/document';
import type { CollisionDrag } from './collision.type';
import { rectOfCorners } from './rect-of-corners';

const previewShape = (collision: TileCollision | undefined, drag: CollisionDrag | null): TileCollision | null => {
  if (drag?.kind === 'rect') return rectOfCorners(drag.from, drag.to) ?? collision ?? null;
  if (drag?.kind === 'point' && collision?.kind === 'polygon') {
    return { kind: 'polygon', points: collision.points.map((point, index) => (index === drag.index ? drag.to : point)) };
  }
  return collision ?? null;
};

export { previewShape };
