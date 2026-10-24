/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { BANK_PICK_TEXT } from '../../../sheet-manager/bank-text.constants';
import { flipSprites } from '../../../sheet-manager/flip-sprites';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { trimSprites } from '../../../sheet-manager/trim-sprites';
import { turnSprites } from '../../../sheet-manager/turn-sprites';
import type { ActionContext } from '../SpritesPanel.type';

const transformGroup = ({ model, open }: ActionContext): MenuGroup => {
  const bankCount = model.artwork.banks.length;
  const none = model.ids.length === 0;
  const { ids } = model;
  return {
    id: 'transform',
    label: MANAGER_TEXT.groups.transform,
    items: [
      { id: 'palette', label: BANK_PICK_TEXT.menu, disabled: none || bankCount < 2, onSelect: () => open('bank') },
      { id: 'pivot', label: MANAGER_TEXT.pivot, icon: 'pixel-pivot', disabled: none, onSelect: () => open('pivot') },
      { id: 'resize', label: MANAGER_TEXT.resize, disabled: none, onSelect: () => open('resize') },
      { id: 'trim', label: MANAGER_TEXT.trim, disabled: none, onSelect: () => trimSprites(ids) },
      { separator: true },
      { id: 'flip-h', label: MANAGER_TEXT.flipH, icon: 'pixel-flip-h', disabled: none, onSelect: () => flipSprites(ids, 'horizontal') },
      { id: 'flip-v', label: MANAGER_TEXT.flipV, icon: 'pixel-flip-v', disabled: none, onSelect: () => flipSprites(ids, 'vertical') },
      { id: 'turn-left', label: MANAGER_TEXT.turnLeft, icon: 'pixel-turn-left', disabled: none, onSelect: () => turnSprites(ids, 'counter-clockwise') },
      { id: 'turn-right', label: MANAGER_TEXT.turnRight, icon: 'pixel-turn-right', disabled: none, onSelect: () => turnSprites(ids, 'clockwise') },
      { id: 'turn-half', label: MANAGER_TEXT.turnHalf, disabled: none, onSelect: () => turnSprites(ids, 'half') },
    ],
  };
};

export { transformGroup };
