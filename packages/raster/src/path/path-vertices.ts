/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import { curvePoints } from './curve-points';
import type { PathKind } from './path.type';

const pathVertices = (kind: PathKind, points: readonly Point[]): readonly Point[] =>
  kind === 'curve' ? curvePoints(points) : points;

export { pathVertices };
