/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { SpriteFacts } from './manager.type';

const entryIds = (selected: readonly SpriteId[], facts: readonly SpriteFacts[]): SpriteId[] => {
  const shown = new Set(facts.map((fact) => fact.sprite.id));
  return selected.filter((id) => shown.has(id));
};

export { entryIds };
