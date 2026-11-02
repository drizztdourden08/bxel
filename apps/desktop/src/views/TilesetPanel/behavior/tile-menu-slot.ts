/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { TERRAIN_COMMAND as TERRAIN_ID } from '../../../keymap/terrain-command-id.constants';
import { pickedKey } from '../../../tilemap/picked-key';
import { TILE_MENU } from '../TilesetPanel.constants';

const tileMenuSlot = (slot: number, set: string): readonly ContextMenuEntry[] => {
  const gate = unless(pickedKey() !== null, TILE_MENU.needPick);
  return [
    { command: TERRAIN_ID.editSlot, label: TILE_MENU.assign, args: { slot, action: 'use', set }, ...gate },
    { command: TERRAIN_ID.editSlot, label: TILE_MENU.variant, args: { slot, action: 'add', set }, ...gate },
    { command: TERRAIN_ID.editSlot, label: TILE_MENU.clear, args: { slot, action: 'clear', set } },
    'separator',
    { command: TERRAIN_ID.fillByTurning, args: { set } },
  ];
};

export { tileMenuSlot };
