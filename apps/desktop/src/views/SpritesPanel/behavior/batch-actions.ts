/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera';
import { flipSprites } from '../../../sheet-manager/flip-sprites';
import { removeEntries } from '../../../sheet-manager/remove-entries';
import { trimSprites } from '../../../sheet-manager/trim-sprites';
import { turnSprites } from '../../../sheet-manager/turn-sprites';
import { BATCH_TEXT } from '../../../sheet-manager/sheet-text.constants';
import type { ManagerDialog } from '../../../sheet-manager/manager.type';
import type { ManagerModel } from '../SpritesPanel.type';

const batchActions = (model: ManagerModel, open: (dialog: ManagerDialog) => void): ActionItem[] => {
  const none = model.ids.length === 0;
  const act = (id: string, label: string, icon: ActionItem['icon'], onSelect: () => void): ActionItem => ({ id, label, icon, onSelect, disabled: none });
  return [
    act('pivot', BATCH_TEXT.pivot, 'pixel-pivot', () => open('pivot')),
    act('size', BATCH_TEXT.size, 'maximize-2', () => open('resize')),
    act('trim', BATCH_TEXT.trim, 'pixel-trim', () => trimSprites(model.ids)),
    act('flip', BATCH_TEXT.flip, 'pixel-flip-h', () => flipSprites(model.ids, 'horizontal')),
    act('turn', BATCH_TEXT.turn, 'pixel-turn-right', () => turnSprites(model.ids, 'clockwise')),
    act('palette', BATCH_TEXT.palette, 'palette', () => open('bank')),
    act('rename', BATCH_TEXT.rename, 'pixel-pencil', () => open('rename')),
    act('folder', BATCH_TEXT.folder, 'folder-open', () => open('folder')),
    { ...act('remove', BATCH_TEXT.remove, 'x', () => removeEntries(model.ids, model.picked, model.sheet?.id ?? null)), disabled: model.sheet === null },
  ];
};

export { batchActions };
