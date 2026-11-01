/* @layer renderer-app @kind logic */
import type { Corners, Point } from '@bxel/raster';
import type { MarqueeRule } from './selection.type';

const side = (from: number, to: number): 1 | -1 => (to < from ? -1 : 1);

const sizeCorners = (from: Point, to: Point, rule: MarqueeRule, centre: boolean): Corners => {
  if (centre) {
    const left = from.x - Math.floor(rule.width / 2);
    const top = from.y - Math.floor(rule.height / 2);
    return { from: { x: left, y: top }, to: { x: left + rule.width - 1, y: top + rule.height - 1 } };
  }
  return { from, to: { x: from.x + side(from.x, to.x) * (rule.width - 1), y: from.y + side(from.y, to.y) * (rule.height - 1) } };
};

const ratioEnd = (from: Point, to: Point, rule: MarqueeRule): Point => {
  const scale = Math.max((Math.abs(to.x - from.x) + 1) / rule.width, (Math.abs(to.y - from.y) + 1) / rule.height);
  const across = Math.max(1, Math.round(scale * rule.width));
  const down = Math.max(1, Math.round(scale * rule.height));
  return { x: from.x + side(from.x, to.x) * (across - 1), y: from.y + side(from.y, to.y) * (down - 1) };
};

export { ratioEnd, sizeCorners };
