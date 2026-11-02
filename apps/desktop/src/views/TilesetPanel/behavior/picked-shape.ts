/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { tileOf } from '../../../tilemap/tile-of';
import type { PickedShape } from './picked-shape.type';

const pickedShape = (): PickedShape | null => {
  const tile = tileOf(undefined);
  if (!tile) return null;
  const shapes = tileShapes(tile);
  const index = Math.min(useTilesetViewStore.getState().shapeIndex, shapes.length - 1);
  const shape = shapes[index];
  return shape ? { tile, index, shape } : null;
};

export { pickedShape };
