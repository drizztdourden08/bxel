/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { flagsOfBits } from './flags-of-bits';
import { groupPlacements } from './group-placements';
import { paintSteps } from './paint-steps';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { selectedMap } from './selected-map';
import { selectionCells } from './selection-cells';
import { TILE_LABEL } from './tilemap.constants';
import type { Placement } from './tilemap.type';

const fillSelectionWithStamp = (): boolean => {
  const picked = selectedMap();
  const stamp = picked ? readyStamp(picked.target) : null;
  if (!picked || !stamp) return false;
  const { target, selection } = picked;
  const placements: Placement[] = [];
  for (const cell of selectionCells(selection, target.tilemap)) {
    const column = (((cell.x - selection.rect.x) % stamp.columns) + stamp.columns) % stamp.columns;
    const row = (((cell.y - selection.rect.y) % stamp.rows) + stamp.rows) % stamp.rows;
    const at = row * stamp.columns + column;
    const key = stamp.keys[at] ?? 0;
    const bits = stamp.bits?.[at];
    if (key !== 0) placements.push(bits === undefined ? { key, cell } : { key, cell, flags: flagsOfBits(bits) });
  }
  const groups = groupPlacements(placements, useTilemapStore.getState().flags);
  return runMap(TILE_LABEL.place, paintSteps(target, groups));
};

export { fillSelectionWithStamp };
