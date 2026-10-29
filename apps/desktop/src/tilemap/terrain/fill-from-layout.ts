/* @layer renderer-app @kind logic */
import type { TerrainSet, TileLayout } from '@bxel/document';
import { packingCell } from './packing-cell';
import type { TerrainPacking } from './terrain-packing.type';

const fillFromLayout = (set: TerrainSet, layout: TileLayout, packing: TerrainPacking, start: number): TerrainSet => {
  const first = { column: start % layout.columns, row: Math.floor(start / layout.columns) };
  const slots = set.slots.map((_slot, slot) => {
    const at = packingCell(packing, slot);
    const column = first.column + at.column;
    const tile = column < layout.columns ? layout.slots[(first.row + at.row) * layout.columns + column] : null;
    return tile ? [{ key: tile.key, weight: 1 }] : [];
  });
  return { ...set, slots };
};

export { fillFromLayout };
