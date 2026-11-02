/* @layer renderer-app @kind logic */
import type { VirtualSize } from '@drizztdourden08/tessera';
import { CELL_FRAME } from '../TilesetPanel.constants';
import { CELL_LARGEST, CELL_STEPS } from './cell-size.constants';
import type { TileBox } from './cell-size.type';

const stepFor = (pixels: number): { token: VirtualSize; px: number } => CELL_STEPS.find((step) => step.px >= pixels) ?? { token: 'size-256', px: CELL_LARGEST };

const cellSize = (tile: TileBox, zoom: number): { width: VirtualSize; height: VirtualSize; px: number } => {
  const width = stepFor(tile.tileWidth * zoom + CELL_FRAME);
  const height = stepFor(tile.tileHeight * zoom + CELL_FRAME);
  return { width: width.token, height: height.token, px: width.px };
};

export { cellSize };
