/* @layer core @kind logic */
import type { Pivot2 } from '@bxel/document';
import type { Point, Rect } from '../geometry.type';
import { pointsArea } from './points-area';
import type { RotationTerms } from './region.type';

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
  return pointsArea(corners);
};

export { rotatedBox };
