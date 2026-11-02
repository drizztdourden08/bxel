/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TILESET_COMMAND as TILE_ID } from '../../../keymap/tileset-command-id.constants';
import { TILE_MENU } from '../TilesetPanel.constants';

const tileMenuMulti = (keys: readonly number[]): readonly ContextMenuEntry[] => {
  const args = { key: keys[0] ?? 0 };
  return [
    TILE_ID.useAsStamp,
    TILE_ID.useAsScatter,
    TILE_ID.animationFromTiles,
    'separator',
    {
      label: TILE_MENU.setCollision,
      items: [
        { command: TILE_ID.setCollision, label: TILE_MENU.none, args: { kind: 'none' } },
        { command: TILE_ID.setCollision, label: TILE_MENU.full, args: { kind: 'full' } },
      ],
    },
    { command: TILE_ID.pasteCollision, args },
    { command: TILE_ID.pasteData, args },
    { command: TILE_ID.findOnMap, label: TILE_MENU.find, args },
    'separator',
    { command: TILE_ID.deleteTiles, label: TILE_MENU.deleteMany(keys.length), tone: 'danger', kind: 'confirm', confirm: TILE_MENU.deleteSure(keys.length) },
  ];
};

export { tileMenuMulti };
