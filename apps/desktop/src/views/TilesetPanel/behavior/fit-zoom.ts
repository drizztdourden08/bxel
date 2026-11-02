/* @layer renderer-app @kind logic */
import { ZOOM_MAX } from '../TilesetPanel.constants';
import { capZoom } from './cap-zoom';
import { cellSize } from './cell-size';
import type { TileBox } from './cell-size.type';

const fitZoom = (tile: TileBox, columns: number, width: number): number => {
  for (let zoom = capZoom(tile, ZOOM_MAX); zoom > 1; zoom -= 1) {
    if (cellSize(tile, zoom).px * columns <= width) return zoom;
  }
  return 1;
};

export { fitZoom };
