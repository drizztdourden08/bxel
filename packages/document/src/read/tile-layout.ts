/* @layer core @kind logic */
import type { Tile, Tileset } from '../model/tilemap.type';
import { layoutColumns } from './layout-columns';
import type { TileLayout } from './tile-layout.type';

const claimed = (tileset: Tileset): Map<number, Tile> => {
  const taken = new Map<number, Tile>();
  for (const tile of tileset.tiles) {
    if (tile.layout !== undefined && !taken.has(tile.layout)) taken.set(tile.layout, tile);
  }
  return taken;
};

const tileLayout = (tileset: Tileset): TileLayout => {
  const columns = layoutColumns(tileset);
  const taken = claimed(tileset);
  const placed = new Set(taken.values());
  const indexOf = new Map<number, number>();
  for (const [index, tile] of taken) indexOf.set(tile.key, index);
  let free = 0;
  for (const tile of tileset.tiles) {
    if (placed.has(tile)) continue;
    while (taken.has(free)) free += 1;
    taken.set(free, tile);
    indexOf.set(tile.key, free);
  }
  const last = Math.max(-1, ...taken.keys());
  const rows = Math.max(1, Math.ceil((last + 1) / columns));
  const slots = Array.from({ length: rows * columns }, (_, index) => taken.get(index) ?? null);
  return { columns, rows, slots, indexOf };
};

export { tileLayout };
