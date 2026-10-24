/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { SELECTION_COMMAND_ID as ID } from '../keymap/selection-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';
import { transformMenu } from './transform-menu';

const editMenu = (state: EditorMenuState): MenuItem => {
  const off = { disabled: !state.hasDocument };
  return {
    key: MENU_KEYS.edit,
    label: MENU_TEXT.edit,
    icon: 'pencil',
    children: [
      menuItem(COMMAND_ID.undo, 'Undo', { disabled: !state.canUndo }),
      menuItem(COMMAND_ID.redo, 'Redo', { disabled: !state.canRedo }),
      'separator',
      menuItem(ID.cut, 'Cut', off),
      menuItem(ID.copy, 'Copy', off),
      menuItem(ID.paste, 'Paste', off),
      menuItem(ID.delete, 'Delete', off),
      'separator',
      menuItem(ID.selectAll, 'Select all', off),
      menuItem(ID.clear, 'Deselect', off),
      menuItem(ID.invert, 'Invert selection', off),
      menuItem(ID.expand, 'Expand selection by 1 pixel', off),
      menuItem(ID.shrink, 'Shrink selection by 1 pixel', off),
      'separator',
      transformMenu(state),
    ],
  };
};

export { editMenu };
