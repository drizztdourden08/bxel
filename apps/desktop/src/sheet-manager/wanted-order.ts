/* @layer renderer-app @kind logic */
import type { Sprite, SpriteId } from '@bxel/document';

const wantedOrder = (all: readonly Sprite[], sorted: readonly SpriteId[]): SpriteId[] => {
  const queue = [...sorted];
  return all.map((sprite) => (sprite.role === 'sprite' ? (queue.shift() ?? sprite.id) : sprite.id));
};

export { wantedOrder };
