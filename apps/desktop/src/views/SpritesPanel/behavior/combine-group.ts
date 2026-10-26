/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../sheet-manager/compose-text.constants';
import type { ActionContext } from '../SpritesPanel.type';

const combineGroup = ({ model, open }: ActionContext): MenuGroup => {
  const picked = new Set(model.ids);
  return {
    id: 'combine',
    label: COMPOSE_TEXT.group,
    items: [
      { id: 'animate', label: COMPOSE_TEXT.merge, disabled: picked.size < 1, onSelect: () => open('animate') },
      { id: 'strip', label: COMPOSE_TEXT.strip, disabled: picked.size !== 1, onSelect: () => open('strip') },
      { id: 'slice', label: COMPOSE_TEXT.slice, disabled: picked.size === 0, onSelect: () => open('slice') },
    ],
  };
};

export { combineGroup };
