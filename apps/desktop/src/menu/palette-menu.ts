/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { DIALOG_COMMAND } from '../keymap/dialog-command-id.constants';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const paletteMenu = (state: EditorMenuState): MenuItem => {
  const off = { disabled: !state.hasDocument };
  return {
    key: MENU_KEYS.palette,
    label: MENU_TEXT.palette,
    icon: 'palette',
    children: [
      menuItem(COMMAND_ID.swapColours, 'Swap colours', off),
      menuItem(COMMAND_ID.swapColourPairs, 'Swap colour pairs', off),
      menuItem(COMMAND_ID.colourBack, 'Previous colour', off),
      menuItem(COMMAND_ID.colourForward, 'Next colour', off),
      'separator',
      menuItem(DIALOG_COMMAND.deleteSwatch, 'Delete swatch...', off),
      menuItem(DIALOG_COMMAND.mergeSwatch, 'Merge swatch...', off),
      menuItem(DIALOG_COMMAND.changeLimit, 'Change colour limit...', off),
    ],
  };
};

export { paletteMenu };
