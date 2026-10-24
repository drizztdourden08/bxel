/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';

const invertIds = (order: readonly SpriteId[], selected: readonly SpriteId[]): SpriteId[] => {
  const chosen = new Set(selected);
  return order.filter((id) => !chosen.has(id));
};

export { invertIds };
