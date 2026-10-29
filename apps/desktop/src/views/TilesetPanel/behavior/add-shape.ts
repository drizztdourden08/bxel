/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { Tile, TileCollision } from '@bxel/document';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setShapes } from '../../../tilemap/set-shapes';

const addShape = (tile: Tile, shape: TileCollision): boolean => {
  const view = useTilesetViewStore.getState();
  if (shape.kind !== 'full') view.setLastShape(shape);
  const added = setShapes([tile.key], [{ ...shape, layer: view.collisionLayer }], 'add');
  if (added) view.setShapeIndex(tileShapes(tile).length);
  return added;
};

export { addShape };
