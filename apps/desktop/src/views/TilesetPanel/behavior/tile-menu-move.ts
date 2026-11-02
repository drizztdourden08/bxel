/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TILESET_COMMAND as TILE_ID } from '../../../keymap/tileset-command-id.constants';
import { LAYOUT_STEPS } from '../../../tilemap/move-tile.constants';
import { TILE_MENU } from '../TilesetPanel.constants';

const moveEntry = (key: number): ContextMenuEntry => ({
  label: TILE_MENU.move,
  items: LAYOUT_STEPS.map((direction) => ({ command: TILE_ID.moveTile, label: TILE_MENU[direction], args: { key, direction } })),
});

export { moveEntry };
