/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { TILEMAP_COMMAND as ID } from '../../../keymap/tilemap-command-id.constants';
import { TILESET_COMMAND as TILE_ID } from '../../../keymap/tileset-command-id.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { TILE_MENU } from '../TilesetPanel.constants';
import { GRID_ENTRIES } from './tile-menu-entries.constants';

const tileMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const key = menuTarget(context, TILE_MENU.tile)?.dataset.tileKey;
  if (key === undefined) return GRID_ENTRIES;
  return [
    { command: ID.editTile, label: TILE_MENU.edit },
    { command: 'tilemap.use_tile', label: TILE_MENU.place, args: { key: Number(key) } },
    ID.duplicateTile,
    ID.addTile,
    { command: ID.makeUnique, ...unless(useTilemapStore.getState().selection !== null, TILE_MENU.needCells) },
    ...(useTilemapStore.getState().stamp.keys.filter((each) => each !== 0).length > 1 ? [TILE_ID.animationFromTiles] : []),
    'separator',
    { command: TILE_ID.findOnMap, label: TILE_MENU.find, args: { key: Number(key) } },
    { label: TILE_MENU.collisionMenu, items: [{ command: TILE_ID.copyCollision, args: { key: Number(key) } }, { command: TILE_ID.pasteCollision, args: { key: Number(key) } }] },
    { label: TILE_MENU.dataMenu, items: [{ command: TILE_ID.copyData, args: { key: Number(key) } }, { command: TILE_ID.pasteData, args: { key: Number(key) } }] },
    'separator',
    { command: ID.deleteTile, label: TILE_MENU.remove, tone: 'danger' },
  ];
};

export { tileMenuEntries };
