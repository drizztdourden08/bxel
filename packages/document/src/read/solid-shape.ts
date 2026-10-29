/* @layer core @kind logic */
import { DEFAULT_COLLISION_LAYER } from '../model/tilemap-limits.constants';
import type { Tile, TileShape } from '../model/tilemap.type';
import { tileShapes } from './tile-shapes';

const solidShape = (tile: Tile): TileShape | undefined => {
  const shapes = tileShapes(tile);
  return shapes.find((shape) => shape.layer === DEFAULT_COLLISION_LAYER) ?? shapes[0];
};

export { solidShape };
