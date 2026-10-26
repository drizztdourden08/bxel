/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { sizeOptions } from '../../../sheet-manager/size-options';
import { tagOptions } from '../../../sheet-manager/tag-options';
import { TRAIT_TEXT } from '../../../sheet-manager/trait-text.constants';

const traitEntry = (command: string, kind: 'tag' | 'size' | 'bank', value: string, label: string): ContextMenuEntry => ({
  command,
  label,
  args: { kind, value },
});

const traitEntries = ({ facts, artwork }: Pick<CurrentManager, 'facts' | 'artwork'>): readonly ContextMenuEntry[] => {
  const sprites = facts.map((fact) => fact.sprite);
  const pick = (kind: 'tag' | 'size' | 'bank', value: string, label: string): ContextMenuEntry => traitEntry('sprite.select_by_trait', kind, value, label);
  return [
    { label: TRAIT_TEXT.selectTag, items: tagOptions(sprites).map((tag) => pick('tag', tag, tag)) },
    { label: TRAIT_TEXT.selectSize, items: sizeOptions(sprites).map((size) => pick('size', size, size)) },
    { label: TRAIT_TEXT.selectBank, items: artwork.banks.map((bank) => pick('bank', bank.id, bank.name)) },
  ];
};

export { traitEntries };
