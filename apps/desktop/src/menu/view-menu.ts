/* @layer renderer-app @kind logic */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { COMMAND_ID, TILED_COMMAND } from '../keymap/keymap.constants';
import { TILE_LABELS, TILE_MODES } from '../stores/view-store.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const viewMenu = (state: EditorMenuState): MenuItem => {
  const off = { disabled: !state.hasDocument };
  const tiled: MenuEntry[] = TILE_MODES.map((mode) =>
    menuItem(TILED_COMMAND[mode], TILE_LABELS[mode], { ...off, checked: state.tiled === mode }),
  );
  return {
    key: MENU_KEYS.view,
    label: MENU_TEXT.view,
    icon: 'eye',
    children: [
      {
        key: 'view-zoom',
        label: MENU_TEXT.zoom,
        icon: 'zoom-in',
        children: [
          menuItem(COMMAND_ID.zoomIn, 'Zoom in', off),
          menuItem(COMMAND_ID.zoomOut, 'Zoom out', off),
          menuItem(COMMAND_ID.zoomFit, 'Zoom to fit', off),
          menuItem(COMMAND_ID.zoomActual, 'Actual size', off),
        ],
      },
      {
        key: 'view-grid',
        label: MENU_TEXT.grid,
        children: [
          menuItem(COMMAND_ID.pixelGrid, 'Pixel grid', { ...off, checked: state.grid }),
          menuItem(COMMAND_ID.majorGrid, 'Major grid', { ...off, checked: state.gridMajor }),
          menuItem(COMMAND_ID.tileGrid, 'Tile grid', { ...off, checked: state.gridTile }),
        ],
      },
      menuItem(COMMAND_ID.rulers, 'Rulers', { ...off, checked: state.rulers }),
      {
        key: 'view-symmetry',
        label: MENU_TEXT.symmetry,
        children: [
          menuItem(COMMAND_ID.symmetryX, MENU_TEXT.mirrorX, { ...off, checked: state.symmetryX }),
          menuItem(COMMAND_ID.symmetryY, MENU_TEXT.mirrorY, { ...off, checked: state.symmetryY }),
        ],
      },
      { key: 'view-tiled', label: MENU_TEXT.tiled, children: tiled },
    ],
  };
};

export { viewMenu };
