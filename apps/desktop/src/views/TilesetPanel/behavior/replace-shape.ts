/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { Tile, TileShape } from '@bxel/document';
import { setShapes } from '../../../tilemap/set-shapes';

const replaceShape = (tile: Tile, index: number, shape: TileShape): boolean =>
  setShapes([tile.key], tileShapes(tile).map((each, at) => (at === index ? shape : each)), 'set');

export { replaceShape };
