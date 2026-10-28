/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { SHEET_COMMAND as ID } from '../keymap/sheet-command-id.constants';
import { evaluate } from '../ui-context/evaluate';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';

const sheetEntries = (state: EditorMenuState): MenuEntry[] => {
  const { context } = state;
  const item = (id: string, label: string) => ruledItem(context, id, label);
  const arrange = evaluate('menu.sheet.arrange', context).state === 'hidden' ? null : {
    key: MENU_KEYS.arrange,
    label: MENU_TEXT.arrange,
    children: tidyMenu([item(ID.arrangeGrid, 'Grid'), item(ID.arrangePacked, 'Packed'), item(ID.arrangeManual, 'By hand')]),
  };
  return tidyMenu([
    item(ID.isolate, 'Isolate sprite'),
    item(ID.renameSprite, 'Rename sprite'),
    item(ID.duplicateSprite, 'Duplicate sprite'),
    item(ID.deleteSprite, 'Delete sprite'),
    item(ID.moveEarlier, 'Move sprite earlier'),
    item(ID.moveLater, 'Move sprite later'),
    'separator',
    arrange,
    item(ID.sliceAdd, 'Add slice'),
    item(ID.sliceRemove, 'Remove slices'),
    item(ID.importSheet, 'Slice grid...'),
  ]);
};

const sheetItems = (state: EditorMenuState): MenuEntry[] =>
  state.context.isolated ? tidyMenu([ruledItem(state.context, ID.back, MENU_TEXT.backToSheet)]) : sheetEntries(state);

export { sheetItems };
