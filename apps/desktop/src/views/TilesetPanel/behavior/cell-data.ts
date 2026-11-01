/* @layer renderer-app @kind logic */
import type { TileCell } from '../TilesetPanel.type';

const flag = (on: boolean): '' | undefined => (on ? '' : undefined);

const cellData = (cell: TileCell, painting: boolean) => ({
  'data-picked': flag(cell.picked),
  'data-editing': flag(cell.editing),
  'data-dim': flag(!cell.matches),
  'data-painting': flag(painting),
  'data-tile-key': cell.tile.key,
  'data-tile-animated': flag(cell.tile.animation !== undefined),
});

export { cellData };
