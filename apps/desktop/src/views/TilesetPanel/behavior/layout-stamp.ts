/* @layer renderer-app @kind logic */
import type { TileLayout } from '@bxel/document';
import type { TileStamp } from '../../../stores/tilemap-store.type';

const layoutStamp = (layout: TileLayout, from: number, to: number): TileStamp => {
  const { columns } = layout;
  const left = Math.min(from % columns, to % columns);
  const right = Math.max(from % columns, to % columns);
  const top = Math.min(Math.floor(from / columns), Math.floor(to / columns));
  const bottom = Math.max(Math.floor(from / columns), Math.floor(to / columns));
  const keys: number[] = [];
  for (let row = top; row <= bottom; row += 1) {
    for (let column = left; column <= right; column += 1) keys.push(layout.slots[row * columns + column]?.key ?? 0);
  }
  return { columns: right - left + 1, rows: bottom - top + 1, keys };
};

export { layoutStamp };
