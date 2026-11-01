/* @layer renderer-app @kind logic */
import type { Corners, Point } from '@bxel/raster';
import { marqueeSide as side } from './marquee-side';
import type { MarqueeRule } from './selection.type';

const sizeCorners = (from: Point, to: Point, rule: MarqueeRule, centre: boolean): Corners => {
  if (centre) {
    const left = from.x - Math.floor(rule.width / 2);
    const top = from.y - Math.floor(rule.height / 2);
    return { from: { x: left, y: top }, to: { x: left + rule.width - 1, y: top + rule.height - 1 } };
  }
  return { from, to: { x: from.x + side(from.x, to.x) * (rule.width - 1), y: from.y + side(from.y, to.y) * (rule.height - 1) } };
};

export { sizeCorners };
