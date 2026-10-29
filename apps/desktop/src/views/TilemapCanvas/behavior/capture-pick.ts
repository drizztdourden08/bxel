/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { captureCells } from '../../../tilemap/capture-cells';
import { pickAt } from '../../../tilemap/pick-at';
import { spanRect } from './span-rect';

const capturePick = (from: Point, to: Point): boolean => {
  if (from.x === to.x && from.y === to.y) return pickAt(from);
  return captureCells(spanRect(from, to));
};

export { capturePick };
