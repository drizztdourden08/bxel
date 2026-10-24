/* @layer renderer-app @kind logic */
import type { MenuNode } from '@drizztdourden08/tessera';
import { idsByTrait } from '../../../sheet-manager/ids-by-trait';
import { selectIds } from '../../../sheet-manager/select-ids';
import { TRAIT_TEXT } from '../../../sheet-manager/trait-text.constants';
import type { ActionContext } from '../SpritesPanel.type';

const traitItems = ({ model }: ActionContext): MenuNode[] => {
  const pick = (kind: 'tag' | 'size' | 'bank', value: string) => (): void => selectIds(idsByTrait(model.facts, { kind, value }));
  return [
    {
      id: 'select-tag',
      label: TRAIT_TEXT.selectTag,
      disabled: model.tags.length === 0,
      children: model.tags.map((tag) => ({ id: `tag-${tag}`, label: tag, onSelect: pick('tag', tag) })),
    },
    {
      id: 'select-size',
      label: TRAIT_TEXT.selectSize,
      children: model.sizes.map((size) => ({ id: `size-${size}`, label: size, onSelect: pick('size', size) })),
    },
    {
      id: 'select-bank',
      label: TRAIT_TEXT.selectBank,
      children: model.artwork.banks.map((bank) => ({ id: `bank-${bank.id}`, label: bank.name, onSelect: pick('bank', bank.id) })),
    },
  ];
};

export { traitItems };
