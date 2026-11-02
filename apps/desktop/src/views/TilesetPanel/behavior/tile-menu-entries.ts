/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { TILE_MENU } from '../TilesetPanel.constants';
import { GRID_ENTRIES } from './tile-menu-entries.constants';
import { tileMenuHole } from './tile-menu-hole';
import { tileMenuMulti } from './tile-menu-multi';
import { tileMenuShape } from './tile-menu-shape';
import { tileMenuSingle } from './tile-menu-single';
import { tileMenuSlot } from './tile-menu-slot';

const sideEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] | undefined => {
  if (menuTarget(context, TILE_MENU.shapes)) return tileMenuShape();
  const slot = menuTarget(context, TILE_MENU.slot)?.dataset;
  if (slot?.terrainSlot !== undefined) return tileMenuSlot(Number(slot.terrainSlot), slot.terrainSet ?? '');
  const hole = menuTarget(context, TILE_MENU.hole)?.dataset.holeIndex;
  return hole === undefined ? undefined : tileMenuHole(Number(hole));
};

const tileMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const side = sideEntries(context);
  if (side !== undefined) return side;
  const key = menuTarget(context, TILE_MENU.tile)?.dataset.tileKey;
  if (key === undefined) return GRID_ENTRIES;
  const keys = [...(context.selection ?? [])].map(Number);
  return keys.length > 1 ? tileMenuMulti(keys) : tileMenuSingle(Number(key));
};

export { tileMenuEntries };
