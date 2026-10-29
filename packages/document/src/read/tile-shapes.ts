/* @layer core @kind logic */
import type { Tile, TileShape } from '../model/tilemap.type';
import { NO_SHAPES } from './tile-shapes.constants';

const tileShapes = (tile: Tile): readonly TileShape[] => tile.shapes ?? NO_SHAPES;

export { tileShapes };
