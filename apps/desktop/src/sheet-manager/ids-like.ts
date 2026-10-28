/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { folderPath } from './folder-path';
import type { Likeness } from './ids-like.type';
import type { SpriteFacts } from './manager.type';
import { sizeKey } from './size-key';

const keyOf = (fact: SpriteFacts, likeness: Likeness): string => (likeness === 'size' ? sizeKey(fact.sprite) : folderPath(fact.sprite.name));

const idsLike = (facts: readonly SpriteFacts[], picked: readonly SpriteId[], likeness: Likeness): SpriteId[] => {
  const wanted = new Set(facts.filter((fact) => picked.includes(fact.sprite.id)).map((fact) => keyOf(fact, likeness)));
  return facts.filter((fact) => wanted.has(keyOf(fact, likeness))).map((fact) => fact.sprite.id);
};

export { idsLike };
