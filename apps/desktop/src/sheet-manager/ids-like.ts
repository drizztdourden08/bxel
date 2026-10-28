/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { folderPath } from './folder-path';
import type { SpriteFacts } from './manager.type';
import { sizeKey } from './size-key';

type Likeness = 'size' | 'folder';

const keyOf = (fact: SpriteFacts, likeness: Likeness): string => (likeness === 'size' ? sizeKey(fact.sprite) : folderPath(fact.sprite.name));

/** The sprites that share a size, or a folder, with any of the picked sprites. */
const idsLike = (facts: readonly SpriteFacts[], picked: readonly SpriteId[], likeness: Likeness): SpriteId[] => {
  const wanted = new Set(facts.filter((fact) => picked.includes(fact.sprite.id)).map((fact) => keyOf(fact, likeness)));
  return facts.filter((fact) => wanted.has(keyOf(fact, likeness))).map((fact) => fact.sprite.id);
};

export type { Likeness };
export { idsLike };
