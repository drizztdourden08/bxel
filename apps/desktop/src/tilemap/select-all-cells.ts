/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { readCell } from './read-cell';

const selectAllCells = (): void => {
  const target = currentMap();
  if (!target) return;
  const { columns, rows } = target.tilemap;
  const from = readCell(target.tilemap, target.layer, { x: 0, y: 0 })?.key ?? 0;
  useTilemapStore.getState().setSelection({ rect: { x: 0, y: 0, width: columns, height: rows }, from });
};

export { selectAllCells };
