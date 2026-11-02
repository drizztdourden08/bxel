/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TILEMAP_COMMAND as ID } from '../../../keymap/tilemap-command-id.constants';
import { TILESET_COMMAND as TILE_ID } from '../../../keymap/tileset-command-id.constants';
import { TILE_MENU } from '../TilesetPanel.constants';

const tileMenuHole = (index: number): readonly ContextMenuEntry[] => [{ command: TILE_ID.addTileAt, label: TILE_MENU.addHere, args: { index } }, ID.newTileset, ID.newTilemap];

export { tileMenuHole };
