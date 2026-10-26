/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { currentMap } from '../../../tilemap/current-map';
import { readCell } from '../../../tilemap/read-cell';
import { cellInSelection } from './cell-in-selection';

const selectClickedCell = (cell: Point | null): void => {
  const store = useTilemapStore.getState();
  if (cellInSelection(cell, store.selection)) return;
  const target = currentMap();
  if (cell === null || useToolStore.getState().tool !== 'select' || !target) {
    if (store.selection !== null) store.setSelection(null);
    return;
  }
  store.setSelection({ rect: { x: cell.x, y: cell.y, width: 1, height: 1 }, from: readCell(target.tilemap, target.layer, cell)?.key ?? 0 });
};

export { selectClickedCell };
