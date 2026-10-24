/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../sheet-manager/compose-text.constants';
import type { ActionContext } from '../SpritesPanel.type';

const combineGroup = ({ model, open }: ActionContext): MenuGroup => {
  const picked = new Set(model.ids);
  const animated = model.facts.some((fact) => picked.has(fact.sprite.id) && fact.frames > 1);
  return {
    id: 'combine',
    label: COMPOSE_TEXT.group,
    items: [
      { id: 'merge', label: COMPOSE_TEXT.merge, disabled: picked.size < 2, onSelect: () => open('merge') },
      { id: 'split', label: COMPOSE_TEXT.split, disabled: !animated, onSelect: () => open('split') },
      { id: 'slice', label: COMPOSE_TEXT.slice, disabled: picked.size === 0, onSelect: () => open('slice') },
    ],
  };
};

export { combineGroup };
