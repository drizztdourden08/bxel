/* @layer renderer-app @kind logic */
import type { Corners, Point } from '@bxel/raster';
import { constrainCorner } from '../constrain-corner';
import { ratioEnd } from './marquee-corners';
import { FREE_MARQUEE } from './marquee-rule.constants';
import type { MarqueeRule, ShapeHold } from './selection.type';
import { sizeCorners } from './size-corners';

const endOf = (from: Point, to: Point, hold: ShapeHold, rule: MarqueeRule): Point => {
  if (hold.square) return constrainCorner('rect', from, to);
  return rule.fixed === 'ratio' ? ratioEnd(from, to, rule) : to;
};

const shapeCorners = (from: Point, to: Point, hold: ShapeHold, rule: MarqueeRule = FREE_MARQUEE): Corners => {
  if (rule.fixed === 'size') return sizeCorners(from, to, rule, hold.centre);
  const end = endOf(from, to, hold, rule);
  if (!hold.centre) return { from, to: end };
  return { from: { x: from.x - (end.x - from.x), y: from.y - (end.y - from.y) }, to: end };
};

export { shapeCorners };
