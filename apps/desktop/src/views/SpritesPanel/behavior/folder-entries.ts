/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { SPRITE_MENU } from '../SpritesPanel.constants';

const folderEntries = ({ ids }: Pick<CurrentManager, 'ids'>): ContextMenuEntry => {
  const pick = unless(ids.length > 0, MANAGER_TEXT.none);
  return {
    label: MANAGER_TEXT.folderGroup,
    items: [
      { command: 'sprite.move_to_folder', label: SPRITE_MENU.moveToFolder, ...pick },
      { command: 'sprite.folder_from_selection', label: MANAGER_TEXT.folderFromSelection, ...pick },
    ],
  };
};

export { folderEntries };
