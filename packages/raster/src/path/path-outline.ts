/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import { linePoints } from '../line-points';
import { curvePoints } from './curve-points';
import type { PathKind } from './path.type';

const closedOutline = (vertices: readonly Point[]): Point[] =>
  vertices.flatMap((from, at) => linePoints({ from, to: vertices[(at + 1) % vertices.length] ?? from }));

const pathOutline = (kind: PathKind, points: readonly Point[]): Point[] =>
  kind === 'curve' ? curvePoints(points) : closedOutline(points);

export { pathOutline };
