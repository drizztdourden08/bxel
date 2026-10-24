/* @layer renderer-app @kind logic */
import type { Point, SpriteId } from '@bxel/document';
import type { AtlasItem } from './manager.type';

const atlasHit = (items: readonly AtlasItem[], point: Point): SpriteId | null => {
  const hit = [...items]
    .reverse()
    .find((item) => point.x >= item.x && point.x < item.x + item.width && point.y >= item.y && point.y < item.y + item.height);
  return hit?.id ?? null;
};

export { atlasHit };
