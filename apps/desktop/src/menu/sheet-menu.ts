/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { SHEET_COMMAND as ID } from '../keymap/sheet-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const sheetEntries = (): MenuEntry[] => [
  menuItem(ID.isolate, 'Isolate sprite'),
  menuItem(ID.renameSprite, 'Rename sprite'),
  menuItem(ID.duplicateSprite, 'Duplicate sprite'),
  menuItem(ID.deleteSprite, 'Delete sprite'),
  menuItem(ID.moveEarlier, 'Move sprite earlier'),
  menuItem(ID.moveLater, 'Move sprite later'),
  'separator',
  {
    key: MENU_KEYS.arrange,
    label: MENU_TEXT.arrange,
    children: [menuItem(ID.arrangeGrid, 'Grid'), menuItem(ID.arrangePacked, 'Packed'), menuItem(ID.arrangeManual, 'By hand')],
  },
  menuItem(ID.sliceAdd, 'Add slice'),
  menuItem(ID.sliceRemove, 'Remove slices'),
  menuItem(ID.importSheet, 'Slice grid...'),
];

const sheetItems = (state: EditorMenuState): MenuEntry[] =>
  state.isolated ? [menuItem(ID.back, MENU_TEXT.backToSheet)] : sheetEntries();

export { sheetItems };
