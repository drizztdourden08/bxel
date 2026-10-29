/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { SPRITE_MENU } from '../SpritesPanel.constants';
import { arrangeEntries } from './arrange-entries';

const sheetEntries = (manager: Pick<CurrentManager, 'ids' | 'picked' | 'sheet' | 'artwork'>): ContextMenuEntry => {
  const { ids, picked, sheet, artwork } = manager;
  const others = artwork.sheets.filter((each) => each.id !== sheet?.id);
  const count = ids.length + picked.length;
  return {
    label: MANAGER_TEXT.groups.sheet,
    items: [
      { command: 'sprite.remove_from_sheet', label: MANAGER_TEXT.removeFromSheet, ...unless(count > 0 && sheet !== null, SPRITE_MENU.noSheet) },
      {
        label: MANAGER_TEXT.moveToSheet,
        disabled: ids.length === 0 || others.length === 0,
        items: others.map((each) => ({ command: 'sprite.move_to_sheet', label: each.name, args: { sheetId: each.id } })),
      },
      {
        label: MANAGER_TEXT.copyToSheet,
        disabled: count === 0 || others.length === 0,
        items: others.map((each) => ({ command: 'sprite.copy_to_sheet', label: each.name, args: { sheetId: each.id } })),
      },
      { label: MANAGER_TEXT.arrangeLabel, items: arrangeEntries(manager) },
      {
        label: MANAGER_TEXT.exportSelection,
        disabled: ids.length === 0,
        items: [
          { command: 'sprite.export_selection_sheet', label: MANAGER_TEXT.exportAsSheet },
          { command: 'sprite.export_selection_files', label: MANAGER_TEXT.exportAsFiles },
        ],
      },
    ],
  };
};

export { sheetEntries };
