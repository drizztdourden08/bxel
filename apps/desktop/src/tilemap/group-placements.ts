/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import type { Placement, PlacementGroup } from './tilemap.type';

const groupPlacements = (placements: readonly Placement[], flags: CellFlags): PlacementGroup[] => {
  const groups = new Map<number, PlacementGroup>();
  for (const placement of placements) {
    const group = groups.get(placement.key) ?? { key: placement.key, flags, cells: [] };
    group.cells.push(placement.cell);
    groups.set(placement.key, group);
  }
  return [...groups.values()];
};

export { groupPlacements };
