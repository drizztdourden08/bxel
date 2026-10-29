/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { Tile } from '@bxel/document';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setShapes } from '../../../tilemap/set-shapes';

const removeShape = (tile: Tile, index: number): boolean => {
  useTilesetViewStore.getState().setShapeIndex(Math.max(0, index - 1));
  return setShapes([tile.key], tileShapes(tile).filter((_each, at) => at !== index), 'set');
};

export { removeShape };
