/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { pickTile } from '../../../tilemap/pick-tile';
import { TILE_MENU } from '../TilesetPanel.constants';
import { tileMenuEntries } from './tile-menu-entries';
import { ruledEntries } from '../../../context-menu/ruled-entries';

const pickClicked = (context: ContextMenuContext): void => {
  const key = menuTarget(context, TILE_MENU.tile)?.dataset.tileKey;
  if (key !== undefined && !useTilemapStore.getState().stamp.keys.includes(Number(key))) pickTile(Number(key));
};

const useTilesetMenu = (): void => {
  useContextMenu(COMMAND_ZONE.tileset, { label: TILE_MENU.label, beforeOpen: pickClicked, entries: ruledEntries(tileMenuEntries) });
};

export { useTilesetMenu };
