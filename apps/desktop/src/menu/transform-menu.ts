/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { SELECTION_COMMAND_ID as ID } from '../keymap/selection-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const transformMenu = (state: EditorMenuState): MenuItem => {
  const off = { disabled: !state.hasDocument };
  return {
    key: MENU_KEYS.transform,
    label: MENU_TEXT.transform,
    children: [
      menuItem(ID.flipHorizontal, 'Flip horizontal', off),
      menuItem(ID.flipVertical, 'Flip vertical', off),
      menuItem(ID.turnClockwise, 'Rotate 90 clockwise', off),
      menuItem(ID.turnCounterClockwise, 'Rotate 90 counterclockwise', off),
      'separator',
      menuItem(ID.rotate, 'Rotate...', off),
      menuItem(ID.scale, 'Scale...', off),
    ],
  };
};

export { transformMenu };
