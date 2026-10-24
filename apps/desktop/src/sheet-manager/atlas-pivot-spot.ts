/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { AtlasItem } from './manager.type';

const atlasPivotSpot = (item: AtlasItem): Point => {
  const across = item.pivot.x2 / 2 - item.source.x;
  const down = item.pivot.y2 / 2 - item.source.y;
  return item.rotated ? { x: item.x + item.height - down, y: item.y + across } : { x: item.x + across, y: item.y + down };
};

export { atlasPivotSpot };
