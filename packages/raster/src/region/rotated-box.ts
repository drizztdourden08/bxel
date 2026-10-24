/* @layer core @kind logic */
import type { Pivot2 } from '@bxel/document';
import type { Point, Rect } from '../geometry.type';
import { ROUNDING_SCALE } from './region.constants';
import type { RotationTerms } from './region.type';

const clean = (value: number): number => Math.round(value * ROUNDING_SCALE) / ROUNDING_SCALE;

const turnPoint = (point: Point, pivot: Pivot2, terms: RotationTerms): Point => {
  const dx = point.x - pivot.x2 / 2;
  const dy = point.y - pivot.y2 / 2;
  return {
    x: pivot.x2 / 2 + terms.cos * dx - terms.sin * dy,
    y: pivot.y2 / 2 + terms.sin * dx + terms.cos * dy,
  };
};

const rotatedBox = (box: Rect, pivot: Pivot2, terms: RotationTerms): Rect => {
  const right = box.x + box.width;
  const bottom = box.y + box.height;
  const corners = [
    { x: box.x, y: box.y },
    { x: right, y: box.y },
    { x: box.x, y: bottom },
    { x: right, y: bottom },
  ].map((corner) => turnPoint(corner, pivot, terms));
  const xs = corners.map((corner) => clean(corner.x));
  const ys = corners.map((corner) => clean(corner.y));
  const left = Math.floor(Math.min(...xs));
  const top = Math.floor(Math.min(...ys));
  return { x: left, y: top, width: Math.ceil(Math.max(...xs)) - left, height: Math.ceil(Math.max(...ys)) - top };
};

export { rotatedBox };
