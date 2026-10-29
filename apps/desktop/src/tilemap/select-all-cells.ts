/* @layer renderer-app @kind logic */
import { currentMap } from './current-map';
import { readCell } from './read-cell';
import { commitMapSelection } from './commit-map-selection';

const selectAllCells = (): void => {
  const target = currentMap();
  if (!target) return;
  const { columns, rows } = target.tilemap;
  const from = readCell(target.tilemap, target.layer, { x: 0, y: 0 })?.key ?? 0;
  commitMapSelection({ rect: { x: 0, y: 0, width: columns, height: rows }, from, mask: null });
};

export { selectAllCells };
