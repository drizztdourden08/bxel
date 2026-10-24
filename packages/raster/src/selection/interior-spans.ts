/* @layer core @kind logic */
import type { Corners, Size, Span } from '../geometry.type';
import { rowCrossings } from './row-crossings';

const rowSpans = (edges: readonly Corners[], y: number): Span[] => {
  const crossings = rowCrossings(edges, y);
  const spans: Span[] = [];
  for (let at = 0; at + 1 < crossings.length; at += 2) {
    spans.push({ y, x0: Math.ceil(crossings[at] ?? 0), x1: Math.floor(crossings[at + 1] ?? 0) });
  }
  return spans;
};

const interiorSpans = (edges: readonly Corners[], size: Size): Span[] => {
  const ys = edges.flatMap((edge) => [edge.from.y, edge.to.y]);
  const top = Math.max(0, ys.reduce((low, y) => Math.min(low, y), size.height));
  const bottom = Math.min(size.height - 1, ys.reduce((high, y) => Math.max(high, y), -1));
  const spans: Span[] = [];
  for (let y = top; y <= bottom; y++) {
    spans.push(...rowSpans(edges, y));
  }
  return spans;
};

export { interiorSpans };
