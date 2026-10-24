/* @layer renderer-app @kind logic */
import type { Point, SpriteId } from '@bxel/document';
import { atlasExtent } from './atlas-extent';
import type { AtlasItem } from './manager.type';

const covers = (item: AtlasItem, point: Point): boolean => {
  const { width, height } = atlasExtent(item);
  return point.x >= item.x && point.x < item.x + width && point.y >= item.y && point.y < item.y + height;
};

const atlasHit = (items: readonly AtlasItem[], point: Point): SpriteId | null => [...items].reverse().find((item) => covers(item, point))?.id ?? null;

export { atlasHit };
