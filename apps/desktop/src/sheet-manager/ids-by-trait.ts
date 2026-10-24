/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { SpriteFacts } from './manager.type';
import { sizeKey } from './size-key';
import type { SelectTrait } from './trait.type';

const matches = (fact: SpriteFacts, trait: SelectTrait): boolean => {
  if (trait.kind === 'tag') return fact.sprite.tags.some((tag) => tag.name === trait.value);
  if (trait.kind === 'size') return sizeKey(fact.sprite) === trait.value;
  return fact.sprite.bankId === trait.value;
};

const idsByTrait = (facts: readonly SpriteFacts[], trait: SelectTrait): SpriteId[] =>
  facts.filter((fact) => matches(fact, trait)).map((fact) => fact.sprite.id);

export { idsByTrait };
