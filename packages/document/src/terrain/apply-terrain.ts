/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { TerrainRules } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import { neighbourMask } from './neighbour-mask';
import { slotKey } from './slot-key';
import { terrainIndex } from './terrain-index';
import { touchedCells } from './touched-cells';

const applyTerrain = (cells: Uint32Array, grid: Size, rules: TerrainRules, edit: { indexes: readonly number[]; erase: boolean }): void => {
  const members = new Set(rules.keys.filter((key) => key !== 0));
  const fallback = rules.keys.find((key) => key !== 0) ?? 0;
  const isMember = (cell: number): boolean => members.has(cellKey(cell));
  for (const index of edit.indexes) cells[index] = edit.erase ? 0 : fallback;
  for (const index of touchedCells(edit.indexes, grid)) {
    if (!isMember(cells[index] ?? 0)) continue;
    const slot = terrainIndex(rules.kind, neighbourMask(cells, grid, index, isMember));
    cells[index] = slotKey(rules.keys, slot, fallback);
  }
};

export { applyTerrain };
