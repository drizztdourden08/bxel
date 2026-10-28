/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import { linePoints } from '../line-points';
import { pixelPerfect } from '../pixel-perfect';
import { curvePoints } from './curve-points';
import type { PathKind } from './path.type';

const closedOutline = (vertices: readonly Point[]): Point[] =>
  vertices.flatMap((from, at) => linePoints({ from, to: vertices[(at + 1) % vertices.length] ?? from }));

const pathOutline = (kind: PathKind, points: readonly Point[], perfect?: boolean): Point[] => {
  if (kind === 'curve') {
    return curvePoints(points, perfect !== false);
  }
  return perfect === true ? pixelPerfect(closedOutline(points)) : closedOutline(points);
};

export { pathOutline };
