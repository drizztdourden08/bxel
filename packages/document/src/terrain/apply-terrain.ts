/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { TerrainRules } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import { neighbourMask } from './neighbour-mask';
import { slotKey } from './slot-key';
import { NEIGHBOUR_STEPS } from './terrain.constants';
import { terrainIndex } from './terrain-index';

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

const applyTerrain = (cells: Uint32Array, grid: Size, rules: TerrainRules, edit: { indexes: readonly number[]; erase: boolean }): void => {
  const members = new Set(rules.keys.filter((key) => key !== 0));
  const fallback = rules.keys.find((key) => key !== 0) ?? 0;
  const isMember = (cell: number): boolean => members.has(cellKey(cell));
  for (const index of edit.indexes) cells[index] = edit.erase ? 0 : fallback;
  for (const index of touched(edit.indexes, grid)) {
    if (!isMember(cells[index] ?? 0)) continue;
    const slot = terrainIndex(rules.kind, neighbourMask(cells, grid, index, isMember));
    cells[index] = slotKey(rules.keys, slot, fallback);
  }
};

export { applyTerrain };
