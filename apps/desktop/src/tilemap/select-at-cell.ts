/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { CombineMode } from '@bxel/raster';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { inBounds } from './in-bounds';
import { selectCells } from './select-cells';

const selectAtCell = (cell: Point, mode: CombineMode): boolean => {
  const target = currentMap();
  const store = useTilemapStore.getState();
  if (!target || store.selectVariant === 'rect') return false;
  if (!inBounds(target.tilemap, cell)) {
    if (mode === 'replace') store.setSelection(null);
    return true;
  }
  const at = { x: cell.x, y: cell.y };
  return selectCells(store.selectVariant === 'wand' ? { by: 'wand', ...at, connectivity: 4 } : { by: 'same', ...at }, mode);
};

export { selectAtCell };
