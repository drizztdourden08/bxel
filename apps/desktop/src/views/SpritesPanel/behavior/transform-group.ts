/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { flipSprites } from '../../../sheet-manager/flip-sprites';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { trimSprites } from '../../../sheet-manager/trim-sprites';
import { turnSprites } from '../../../sheet-manager/turn-sprites';
import type { ActionContext } from '../SpritesPanel.type';
import { pixelMenuIcon } from './pixel-menu-icon';

const transformGroup = ({ model, open }: ActionContext): MenuGroup => {
  const none = model.ids.length === 0;
  const { ids } = model;
  return {
    id: 'transform',
    label: MANAGER_TEXT.groups.transform,
    items: [
      { id: 'pivot', label: MANAGER_TEXT.pivot, icon: pixelMenuIcon('pivot'), disabled: none, onSelect: () => open('pivot') },
      { id: 'resize', label: MANAGER_TEXT.resize, disabled: none, onSelect: () => open('resize') },
      { id: 'trim', label: MANAGER_TEXT.trim, disabled: none, onSelect: () => trimSprites(ids) },
      { separator: true },
      { id: 'flip-h', label: MANAGER_TEXT.flipH, icon: pixelMenuIcon('flipH'), disabled: none, onSelect: () => flipSprites(ids, 'horizontal') },
      { id: 'flip-v', label: MANAGER_TEXT.flipV, icon: pixelMenuIcon('flipV'), disabled: none, onSelect: () => flipSprites(ids, 'vertical') },
      { id: 'turn-left', label: MANAGER_TEXT.turnLeft, icon: pixelMenuIcon('turnLeft'), disabled: none, onSelect: () => turnSprites(ids, 'counter-clockwise') },
      { id: 'turn-right', label: MANAGER_TEXT.turnRight, icon: pixelMenuIcon('turnRight'), disabled: none, onSelect: () => turnSprites(ids, 'clockwise') },
      { id: 'turn-half', label: MANAGER_TEXT.turnHalf, disabled: none, onSelect: () => turnSprites(ids, 'half') },
    ],
  };
};

export { transformGroup };
