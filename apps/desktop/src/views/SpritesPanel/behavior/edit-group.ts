/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { deleteSprites } from '../../../sheet/delete-sprites';
import { duplicateSprites } from '../../../sheet/duplicate-sprites';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { SPRITE_TEXT } from '../../../sheet/sprite-label.constants';
import type { ActionContext } from '../SpritesPanel.type';

const editGroup = ({ model, rename, open }: ActionContext): MenuGroup => {
  const none = model.ids.length === 0;
  const active = model.scene.active;
  return {
    id: 'edit',
    label: MANAGER_TEXT.groups.edit,
    items: [
      {
        id: 'rename',
        label: MANAGER_TEXT.rename,
        shortcut: 'F2',
        icon: 'pixel-pencil',
        disabled: !active,
        onSelect: () => active && rename(active.id),
      },
      { id: 'rename-many', label: MANAGER_TEXT.renameMany, disabled: none, onSelect: () => open('rename') },
      { id: 'duplicate', label: MANAGER_TEXT.duplicate, shortcut: 'Ctrl+Shift+D', icon: 'copy', disabled: none, onSelect: () => duplicateSprites(model.ids) },
      { id: 'isolate', label: MANAGER_TEXT.isolate, shortcut: 'Enter', icon: 'pixel-isolate', disabled: none, onSelect: () => isolateSprite() },
      {
        id: 'delete',
        label: MANAGER_TEXT.remove,
        shortcut: 'Del',
        icon: 'trash-2',
        tone: 'danger',
        kind: 'confirm',
        confirm: SPRITE_TEXT.confirmDelete(model.ids.length),
        disabled: none,
        onSelect: () => deleteSprites(model.ids),
      },
    ],
  };
};

export { editGroup };
