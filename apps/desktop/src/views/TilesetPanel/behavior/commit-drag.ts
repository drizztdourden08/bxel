/* @layer renderer-app @kind logic */
import type { Tile } from '@bxel/document';
import type { CollisionDrag } from '../../../tilemap/collision/collision.type';
import { previewShape } from '../../../tilemap/collision/preview-shape';
import { setCollision } from '../../../tilemap/set-collision';

const commitDrag = (drag: CollisionDrag, tile: Tile): void => {
  const shape = previewShape(tile.collision, drag);
  if (shape && shape !== tile.collision) setCollision(tile.key, shape);
};

export { commitDrag };
