/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { TerrainSet, TerrainVariant } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import { makeCell } from '../tilemap/make-cell';
import { neighbourMask } from './neighbour-mask';
import { pickVariant } from './pick-variant';
import { NEIGHBOUR_STEPS } from './terrain.constants';
import { terrainIndex } from './terrain-index';

const flagsOf = (variant: TerrainVariant) => ({ flipX: variant.flipX === true, flipY: variant.flipY === true, diagonal: variant.diagonal === true });

const variantsAt = (set: TerrainSet, slot: number): readonly TerrainVariant[] => {
  for (let at = slot; at >= 0; at -= 1) {
    const found = set.slots[at] ?? [];
    if (found.length > 0) return found;
  }
  return set.slots.find((each) => each.length > 0) ?? [];
};

const touched = (indexes: readonly number[], grid: Size): Set<number> => {
  const found = new Set<number>();
  for (const index of indexes) {
    const column = index % grid.width;
    const row = (index - column) / grid.width;
    found.add(index);
    for (const [, dx, dy] of NEIGHBOUR_STEPS) {
      const x = column + dx;
      const y = row + dy;
      if (x >= 0 && y >= 0 && x < grid.width && y < grid.height) found.add(y * grid.width + x);
    }
  }
  return found;
};

const applyTerrainSet = (cells: Uint32Array, grid: Size, set: TerrainSet, edit: { indexes: readonly number[]; erase: boolean }): void => {
  const members = new Set(set.slots.flat().map((variant) => variant.key));
  const isMember = (cell: number): boolean => members.has(cellKey(cell));
  const fallback = set.slots.find((slot) => slot.length > 0)?.[0];
  for (const index of edit.indexes) cells[index] = edit.erase || !fallback ? 0 : makeCell(fallback.key, flagsOf(fallback));
  for (const index of touched(edit.indexes, grid)) {
    if (!isMember(cells[index] ?? 0)) continue;
    const slot = terrainIndex(set.kind, neighbourMask(cells, grid, index, isMember));
    const variant = pickVariant(variantsAt(set, slot), index);
    if (variant) cells[index] = makeCell(variant.key, flagsOf(variant));
  }
};

export { applyTerrainSet };
