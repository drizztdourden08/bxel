/* @layer renderer-app @kind logic */
import type { TileLayout } from '@bxel/document';
import type { TileStamp } from '../../../stores/tilemap-store.type';
import { layoutStamp } from './layout-stamp';
import { toggleScatter } from './toggle-scatter';
import { CLEAR_STAMP } from './useGridKeys.constants';

const marqueeStamp = (layout: TileLayout, picked: readonly number[]): TileStamp => {
  const filled = picked.filter((index) => layout.slots[index] != null);
  if (filled.length === 0) return CLEAR_STAMP;
  const { columns } = layout;
  const rows = filled.map((index) => Math.floor(index / columns));
  const cols = filled.map((index) => index % columns);
  const top = Math.min(...rows);
  const bottom = Math.max(...rows);
  const left = Math.min(...cols);
  const right = Math.max(...cols);
  const inside = Array.from({ length: bottom - top + 1 }, (_row, row) =>
    Array.from({ length: right - left + 1 }, (_cell, column) => (top + row) * columns + left + column),
  )
    .flat()
    .filter((index) => layout.slots[index] != null);
  if (inside.length === filled.length) return layoutStamp(layout, top * columns + left, bottom * columns + right);
  return filled.reduce<TileStamp>((stamp, index) => toggleScatter(stamp, layout.slots[index]?.key ?? 0), CLEAR_STAMP);
};

export { marqueeStamp };
