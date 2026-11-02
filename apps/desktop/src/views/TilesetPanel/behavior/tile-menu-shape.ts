/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { TILESET_COMMAND as TILE_ID } from '../../../keymap/tileset-command-id.constants';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { TILE_MENU } from '../TilesetPanel.constants';

const tileMenuShape = (): readonly ContextMenuEntry[] => {
  const { shapeSnap, pointIndex } = useTilesetViewStore.getState();
  return [
    { command: TILE_ID.shapeAddBox, label: TILE_MENU.addBox },
    { command: TILE_ID.shapeTrace, label: TILE_MENU.trace },
    { command: TILE_ID.shapeDelete, label: TILE_MENU.deleteShape },
    { command: TILE_ID.shapeDeletePoint, label: TILE_MENU.deletePoint, ...unless(pointIndex !== null, TILE_MENU.needPoint) },
    'separator',
    {
      label: TILE_MENU.snapMenu,
      items: [
        { command: TILE_ID.shapeSnap, label: TILE_MENU.snapPixel, args: { snap: 'pixel' }, kind: 'radio', checked: shapeSnap === 'pixel' },
        { command: TILE_ID.shapeSnap, label: TILE_MENU.snapHalf, args: { snap: 'half' }, kind: 'radio', checked: shapeSnap === 'half' },
      ],
    },
  ];
};

export { tileMenuShape };
