/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import { bitsOfFlags } from './flag-bits-convert';
import type { Placement, PlacementGroup } from './tilemap.type';

const groupPlacements = (placements: readonly Placement[], flags: CellFlags): PlacementGroup[] => {
  const groups = new Map<string, PlacementGroup>();
  for (const placement of placements) {
    const own = placement.flags ?? flags;
    const id = `${placement.key}:${bitsOfFlags(own)}`;
    const group = groups.get(id) ?? { key: placement.key, flags: own, cells: [] };
    group.cells.push(placement.cell);
    groups.set(id, group);
  }
  return [...groups.values()];
};

export { groupPlacements };
