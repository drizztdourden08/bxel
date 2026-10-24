/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const editMenu = (state: EditorMenuState): MenuItem => ({
  key: MENU_KEYS.edit,
  label: MENU_TEXT.edit,
  icon: 'pencil',
  children: [
    menuItem(COMMAND_ID.undo, 'Undo', { disabled: !state.canUndo }),
    menuItem(COMMAND_ID.redo, 'Redo', { disabled: !state.canRedo }),
  ],
});

export { editMenu };
