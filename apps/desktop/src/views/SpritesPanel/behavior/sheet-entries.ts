/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { SPRITE_MENU } from '../SpritesPanel.constants';
import { arrangeEntries } from './arrange-entries';

const sheetEntries = (manager: Pick<CurrentManager, 'ids' | 'sheet' | 'artwork'>): ContextMenuEntry => {
  const { ids, sheet, artwork } = manager;
  return {
    label: MANAGER_TEXT.groups.sheet,
    items: [
      { command: 'sprite.add_to_sheet', label: MANAGER_TEXT.addToSheet, ...unless(ids.length > 0, MANAGER_TEXT.none) },
      { command: 'sprite.remove_from_sheet', label: MANAGER_TEXT.removeFromSheet, ...unless(ids.length > 0 && sheet !== null, SPRITE_MENU.noSheet) },
      {
        label: MANAGER_TEXT.moveToSheet,
        disabled: ids.length === 0 || sheet === null,
        items: artwork.sheets.map((each) => ({ command: 'sprite.move_to_sheet', label: each.name, args: { sheetId: each.id } })),
      },
      { label: MANAGER_TEXT.arrangeLabel, items: arrangeEntries(manager) },
    ],
  };
};

export { sheetEntries };
