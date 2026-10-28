/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';

const orientStamp = (stamp: TileStamp, flags: CellFlags): TileStamp => {
  if (stamp.scatter || (!flags.flipX && !flags.flipY && !flags.diagonal)) return stamp;
  const width = flags.diagonal ? stamp.rows : stamp.columns;
  const height = flags.diagonal ? stamp.columns : stamp.rows;
  const keys: number[] = [];
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const x = flags.flipX ? width - 1 - column : column;
      const y = flags.flipY ? height - 1 - row : row;
      const sourceColumn = flags.diagonal ? y : x;
      const sourceRow = flags.diagonal ? x : y;
      keys.push(stamp.keys[sourceRow * stamp.columns + sourceColumn] ?? 0);
    }
  }
  return { columns: width, rows: height, keys };
};

export { orientStamp };
