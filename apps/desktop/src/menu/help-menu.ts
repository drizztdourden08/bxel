/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { DEMO_COMMAND_ID, DEMO_TEXT } from '../demo/demo.constants';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import { menuItem } from './menu-item';

const helpMenu = (): MenuItem => ({
  key: MENU_KEYS.help,
  label: MENU_TEXT.help,
  icon: 'circle-help',
  children: [
    menuItem(COMMAND_ID.shortcuts, 'Keyboard shortcuts', { icon: 'keyboard' }),
    menuItem(DEMO_COMMAND_ID, DEMO_TEXT.menu, { icon: 'folder-open' }),
  ],
});

export { helpMenu };
