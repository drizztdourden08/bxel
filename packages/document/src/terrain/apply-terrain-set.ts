/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { TerrainSet, TerrainVariant } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import { makeCell } from '../tilemap/make-cell';
import { neighbourMask } from './neighbour-mask';
import { pickVariant } from './pick-variant';
import { terrainIndex } from './terrain-index';
import { touchedCells } from './touched-cells';

const flagsOf = (variant: TerrainVariant) => ({ flipX: variant.flipX === true, flipY: variant.flipY === true, diagonal: variant.diagonal === true });

const variantsAt = (set: TerrainSet, slot: number): readonly TerrainVariant[] => {
  for (let at = slot; at >= 0; at -= 1) {
    const found = set.slots[at] ?? [];
    if (found.length > 0) return found;
  }
  return set.slots.find((each) => each.length > 0) ?? [];
};

const applyTerrainSet = (cells: Uint32Array, grid: Size, set: TerrainSet, edit: { indexes: readonly number[]; erase: boolean }): void => {
  const members = new Set(set.slots.flat().map((variant) => variant.key));
  const isMember = (cell: number): boolean => members.has(cellKey(cell));
  const fallback = set.slots.find((slot) => slot.length > 0)?.[0];
  for (const index of edit.indexes) cells[index] = edit.erase || !fallback ? 0 : makeCell(fallback.key, flagsOf(fallback));
  for (const index of touchedCells(edit.indexes, grid)) {
    if (!isMember(cells[index] ?? 0)) continue;
    const slot = terrainIndex(set.kind, neighbourMask(cells, grid, index, isMember));
    const variant = pickVariant(variantsAt(set, slot), index);
    if (variant) cells[index] = makeCell(variant.key, flagsOf(variant));
  }
};

export { applyTerrainSet };
