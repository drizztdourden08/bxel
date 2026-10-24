/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuNode } from '@drizztdourden08/tessera';
import { addToSheet } from '../../../sheet-manager/add-to-sheet';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { moveToSheet } from '../../../sheet-manager/move-to-sheet';
import { removeFromSheet } from '../../../sheet-manager/remove-from-sheet';
import type { ActionContext } from '../SpritesPanel.type';

const sheetChoices = ({ model }: ActionContext): MenuNode[] =>
  model.sheet
    ? [
        {
          id: 'move-to-sheet',
          label: MANAGER_TEXT.moveToSheet,
          disabled: model.ids.length === 0,
          children: model.artwork.sheets.map((sheet) => ({
            id: `sheet-${sheet.id}`,
            label: sheet.name,
            onSelect: () => moveToSheet(model.ids, sheet.id),
          })),
        },
      ]
    : [];

const sheetGroup = (ctx: ActionContext): MenuGroup => {
  const { model } = ctx;
  const none = model.ids.length === 0;
  const id = model.sheet?.id ?? null;
  return {
    id: 'sheet',
    label: MANAGER_TEXT.groups.sheet,
    items: [
      { id: 'add-to-sheet', label: MANAGER_TEXT.addToSheet, icon: 'plus', disabled: none, onSelect: () => addToSheet(model.ids, id) },
      {
        id: 'remove-from-sheet',
        label: MANAGER_TEXT.removeFromSheet,
        icon: 'x',
        disabled: none || id === null,
        onSelect: () => removeFromSheet(model.ids, id),
      },
      ...sheetChoices(ctx),
    ],
  };
};

export { sheetGroup };
