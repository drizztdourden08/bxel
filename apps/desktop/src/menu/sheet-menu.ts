/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { SHEET_COMMAND as ID } from '../keymap/sheet-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const sheetMenu = (state: EditorMenuState): MenuItem => {
  const off = { disabled: !state.hasDocument };
  const sheetOnly = { disabled: !state.hasDocument || state.mode !== 'sheet' };
  return {
    key: MENU_KEYS.sheet,
    label: MENU_TEXT.sheet,
    icon: 'pixel-grid-view',
    children: [
      menuItem(ID.modeSprite, 'Sprite mode', { ...off, checked: state.mode === 'sprite' }),
      menuItem(ID.modeSheet, 'Sheet mode', { ...off, checked: state.mode === 'sheet' }),
      'separator',
      menuItem(ID.isolate, 'Isolate sprite', sheetOnly),
      menuItem(ID.renameSprite, 'Rename sprite', off),
      menuItem(ID.duplicateSprite, 'Duplicate sprite', off),
      menuItem(ID.deleteSprite, 'Delete sprite', off),
      menuItem(ID.moveEarlier, 'Move sprite earlier', off),
      menuItem(ID.moveLater, 'Move sprite later', off),
      menuItem(ID.duplicateFrame, 'Duplicate frame', off),
      'separator',
      {
        key: MENU_KEYS.arrange,
        label: MENU_TEXT.arrange,
        children: [
          menuItem(ID.arrangeGrid, 'Grid', off),
          menuItem(ID.arrangePacked, 'Packed', off),
          menuItem(ID.arrangeManual, 'By hand', off),
        ],
      },
      menuItem(ID.sliceAdd, 'Add slice', sheetOnly),
      menuItem(ID.sliceRemove, 'Remove slices', off),
      menuItem(ID.importSheet, 'Slice grid...', off),
    ],
  };
};

export { sheetMenu };
