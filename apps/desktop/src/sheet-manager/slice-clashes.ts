/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import type { Sprite, SpriteId } from '@bxel/document';

const sliceClashes = (names: readonly string[], stay: readonly Sprite[]): SpriteId[] => {
  const wanted = new Set(names.map(nameKey));
  return stay.filter((sprite) => wanted.has(nameKey(sprite.name))).map((sprite) => sprite.id);
};

export { sliceClashes };
