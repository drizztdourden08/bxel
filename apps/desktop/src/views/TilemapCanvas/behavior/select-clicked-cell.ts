/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { currentMap } from '../../../tilemap/current-map';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { readCell } from '../../../tilemap/read-cell';

const selectClickedCell = (cell: Point | null): void => {
  const store = useTilemapStore.getState();
  const { selection } = store;
  const inside = selection !== null && cell !== null && cell.x >= selection.rect.x && cell.y >= selection.rect.y && cell.x < selection.rect.x + selection.rect.width && cell.y < selection.rect.y + selection.rect.height;
  if (inside) return;
  const target = currentMap();
  if (cell === null || useToolStore.getState().tool !== 'select' || !target) {
    if (selection !== null) store.setSelection(null);
    return;
  }
  store.setSelection({ rect: { x: cell.x, y: cell.y, width: 1, height: 1 }, from: readCell(target.tilemap, target.layer, cell)?.key ?? 0 });
};

export { selectClickedCell };
