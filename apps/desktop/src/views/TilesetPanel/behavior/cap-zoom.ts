/* @layer renderer-app @kind logic */
import { CELL_FRAME } from '../TilesetPanel.constants';
import { CELL_LARGEST } from './cell-size.constants';
import type { TileBox } from './cell-size.type';

const capZoom = (tile: TileBox, zoom: number): number => {
  const limit = Math.max(1, Math.floor((CELL_LARGEST - CELL_FRAME) / Math.max(tile.tileWidth, tile.tileHeight)));
  return Math.max(1, Math.min(zoom, limit));
};

export { capZoom };
