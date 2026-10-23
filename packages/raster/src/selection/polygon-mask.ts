/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Point, Size, Span } from '../geometry.type';
import { linePoints } from '../line-points';
import { closedEdges } from './closed-edges';
import { interiorSpans } from './interior-spans';
import { maskFromSpans } from './mask-from-spans';

const pointSpan = (point: Point): Span => ({ y: point.y, x0: point.x, x1: point.x });

const polygonMask = (size: Size, vertices: readonly Point[]): MaskView => {
  const edges = closedEdges(vertices);
  const outline = edges.flatMap((edge) => linePoints(edge).map(pointSpan));
  return maskFromSpans(size, [...interiorSpans(edges, size), ...outline]);
};

export { polygonMask };
