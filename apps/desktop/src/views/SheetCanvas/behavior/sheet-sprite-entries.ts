/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { alignEntries } from '../../../context-menu/align-entries';
import { arrangeKindEntries } from '../../../context-menu/arrange-kind-entries';
import { unless } from '../../../context-menu/unless';
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { SHEET_COMMAND as ID } from '../../../keymap/sheet-command-id.constants';
import { ALIGN_TEXT } from '../../../sheet-manager/align-text.constants';
import { currentManager } from '../../../sheet-manager/current-manager';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { SHEET_MENU } from '../SheetCanvas.constants';

const sheetSpriteEntries = (): readonly ContextMenuEntry[] => {
  const manager = currentManager();
  if (!manager) return [];
  const { sheet, ids } = manager;
  const onSheet = sheet ? ids.filter((id) => sheet.entries.some((entry) => entry.spriteId === id)).length : 0;
  return [
    { command: ID.isolate, label: SHEET_MENU.edit },
    { command: ID.renameSprite, label: SHEET_MENU.rename },
    { command: ID.duplicateSprite, label: SHEET_MENU.duplicate },
    { command: ID.broadcast, label: SHEET_MENU.paintAll, checked: useSpriteStore.getState().broadcast, ...unless(ids.length > 1, SHEET_MENU.needTwo) },
    { label: SHEET_MENU.slice, items: [ID.sliceAdd, ID.sliceRemove] },
    { label: SHEET_MENU.arrange, items: arrangeKindEntries(sheet) },
    { label: ALIGN_TEXT.group, items: alignEntries(manager) },
    {
      label: SHEET_MENU.order,
      items: [ID.moveEarlier, ID.moveLater, { command: 'sprite.move_to_start', label: SHEET_MENU.toStart }, { command: 'sprite.move_to_end', label: SHEET_MENU.toEnd }],
    },
    { command: SELECTION_COMMAND_ID.selectAll, label: SHEET_MENU.selectAll },
    'separator',
    { command: 'sprite.remove_from_sheet', label: SHEET_MENU.removeFromSheet, ...unless(onSheet > 0, SHEET_MENU.notOnSheet) },
    { command: ID.askDeleteSprite },
  ];
};

export { sheetSpriteEntries };
