/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { TILEMAP_COMMAND as ID } from '../../../keymap/tilemap-command-id.constants';
import { TILESET_COMMAND as TILE_ID } from '../../../keymap/tileset-command-id.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { TILE_MENU } from '../TilesetPanel.constants';
import { moveEntry } from './tile-menu-move';
import { terrainSlotEntry } from './tile-menu-terrain';

const tileMenuSingle = (key: number): readonly ContextMenuEntry[] => {
  const args = { key };
  return [
    { command: ID.editTile, label: TILE_MENU.edit },
    { command: 'tilemap.use_tile', label: TILE_MENU.place, args },
    ID.duplicateTile,
    ID.addTile,
    { command: ID.makeUnique, ...unless(useTilemapStore.getState().selection !== null, TILE_MENU.needCells) },
    'separator',
    { command: TILE_ID.findOnMap, label: TILE_MENU.find, args },
    { label: TILE_MENU.collisionMenu, items: [{ command: TILE_ID.copyCollision, args }, { command: TILE_ID.pasteCollision, args }] },
    { label: TILE_MENU.dataMenu, items: [{ command: TILE_ID.copyData, args }, { command: TILE_ID.pasteData, args }] },
    terrainSlotEntry(key),
    moveEntry(key),
    'separator',
    { command: ID.deleteTile, label: TILE_MENU.remove, tone: 'danger' },
  ];
};

export { tileMenuSingle };
