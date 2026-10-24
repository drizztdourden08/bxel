/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { COPY_TEXT } from '../../../sheet-manager/copy-text.constants';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { duplicateSprites } from '../../../sheet/duplicate-sprites';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import type { ActionContext } from '../SpritesPanel.type';
import { pixelMenuIcon } from './pixel-menu-icon';

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
      { id: 'move-to-folder', label: FOLDER_TEXT.menu, disabled: none, onSelect: () => open('folder') },
      { id: 'duplicate', label: MANAGER_TEXT.duplicate, shortcut: 'Ctrl+Shift+D', icon: 'copy', disabled: none, onSelect: () => duplicateSprites(model.ids) },
      { id: 'duplicate-named', label: COPY_TEXT.menu, disabled: none, onSelect: () => open('duplicate') },
      { id: 'isolate', label: MANAGER_TEXT.isolate, shortcut: 'Enter', icon: pixelMenuIcon('isolate'), disabled: none, onSelect: () => isolateSprite() },
      {
        id: 'delete',
        label: MANAGER_TEXT.remove,
        shortcut: 'Del',
        icon: 'trash-2',
        tone: 'danger',
        disabled: none,
        onSelect: () => open('delete'),
      },
    ],
  };
};

export { editGroup };
