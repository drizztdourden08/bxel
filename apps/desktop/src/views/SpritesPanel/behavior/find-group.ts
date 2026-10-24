/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { IDENTICAL_TEXT } from '../../../sheet-manager/identical-text.constants';
import { selectDuplicates } from '../../../sheet-manager/select-duplicates';
import type { ActionContext } from '../SpritesPanel.type';

const findGroup = ({ model, open }: ActionContext): MenuGroup => {
  const sprites = model.facts.map((fact) => fact.sprite);
  return {
    id: 'find',
    label: IDENTICAL_TEXT.group,
    items: [
      { id: 'select-duplicates', label: IDENTICAL_TEXT.selectDuplicates, disabled: sprites.length < 2, onSelect: () => selectDuplicates(sprites, false) },
      {
        id: 'select-duplicates-flipped',
        label: IDENTICAL_TEXT.selectDuplicatesFlipped,
        disabled: sprites.length < 2,
        onSelect: () => selectDuplicates(sprites, true),
      },
      { id: 'compare', label: IDENTICAL_TEXT.compare, disabled: model.ids.length !== 2, onSelect: () => open('compare') },
    ],
  };
};

export { findGroup };
