/* @layer core @kind logic */
import type { Corners, Point } from '../geometry.type';

const snap = (point: Point): Point => ({ x: Math.floor(point.x), y: Math.floor(point.y) });

const closedEdges = (vertices: readonly Point[]): Corners[] => {
  const snapped = vertices.map(snap);
  return snapped.map((from, at) => ({ from, to: snapped[(at + 1) % snapped.length] ?? from }));
};

export { closedEdges };
