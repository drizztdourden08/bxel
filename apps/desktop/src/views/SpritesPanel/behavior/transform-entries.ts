/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { SPRITE_MENU } from '../SpritesPanel.constants';

const transformEntries = ({ ids, artwork }: Pick<CurrentManager, 'ids' | 'artwork'>): ContextMenuEntry => {
  const pick = unless(ids.length > 0, MANAGER_TEXT.none);
  return {
    label: MANAGER_TEXT.groups.transform,
    items: [
      { command: 'sprite.set_palette', label: SPRITE_MENU.palette, ...unless(ids.length > 0 && artwork.banks.length > 1, SPRITE_MENU.oneBank) },
      { command: 'sprite.set_pivot', label: MANAGER_TEXT.pivot, ...pick },
      { command: 'sprite.resize', label: MANAGER_TEXT.resize, ...pick },
      { command: 'sprite.trim', label: MANAGER_TEXT.trim, ...pick },
      { command: 'sprite.flip_horizontal', label: MANAGER_TEXT.flipH, ...pick },
      { command: 'sprite.flip_vertical', label: MANAGER_TEXT.flipV, ...pick },
      { command: 'sprite.turn_left', label: MANAGER_TEXT.turnLeft, ...pick },
      { command: 'sprite.turn_right', label: MANAGER_TEXT.turnRight, ...pick },
      { command: 'sprite.turn_half', label: MANAGER_TEXT.turnHalf, ...pick },
    ],
  };
};

export { transformEntries };
