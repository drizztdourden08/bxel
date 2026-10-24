/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import { composeFlags } from './compose-flags';
import { readCell } from './read-cell';
import { selectionCells } from './selection-cells';
import type { FlagOp, MapTarget, PlacementGroup } from './tilemap.type';
import type { MapSelection } from '../stores/tilemap-store.type';

const flagsKey = (flags: CellFlags): string => `${Number(flags.flipX)}${Number(flags.flipY)}${Number(flags.diagonal)}`;

const turnGroups = (target: MapTarget, selection: MapSelection, op: FlagOp): PlacementGroup[] => {
  const groups = new Map<string, PlacementGroup>();
  for (const cell of selectionCells(selection, target.tilemap)) {
    const read = readCell(target.tilemap, target.layer, cell);
    if (!read || read.key === 0) continue;
    const flags = composeFlags(read.flags, op);
    const key = `${read.key}:${flagsKey(flags)}`;
    const group = groups.get(key) ?? { key: read.key, flags, cells: [] };
    group.cells.push(cell);
    groups.set(key, group);
  }
  return [...groups.values()];
};

export { turnGroups };
