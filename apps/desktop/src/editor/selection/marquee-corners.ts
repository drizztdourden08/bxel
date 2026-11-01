/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { marqueeSide as side } from './marquee-side';
import type { MarqueeRule } from './selection.type';

const ratioEnd = (from: Point, to: Point, rule: MarqueeRule): Point => {
  const scale = Math.max((Math.abs(to.x - from.x) + 1) / rule.width, (Math.abs(to.y - from.y) + 1) / rule.height);
  const across = Math.max(1, Math.round(scale * rule.width));
  const down = Math.max(1, Math.round(scale * rule.height));
  return { x: from.x + side(from.x, to.x) * (across - 1), y: from.y + side(from.y, to.y) * (down - 1) };
};

export { ratioEnd };
