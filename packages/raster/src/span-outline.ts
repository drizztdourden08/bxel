/* @layer core @kind logic */
import type { Point, Span } from './geometry.type';

const spanOutline = (spans: readonly Span[]): Point[] => {
  const rows = new Map(spans.map((span) => [span.y, span] as const));
  const inside = (x: number, y: number): boolean => {
    const row = rows.get(y);
    return row !== undefined && x >= row.x0 && x <= row.x1;
  };
  const points: Point[] = [];
  for (const span of spans) {
    for (let x = span.x0; x <= span.x1; x++) {
      if (!inside(x - 1, span.y) || !inside(x + 1, span.y) || !inside(x, span.y - 1) || !inside(x, span.y + 1)) {
        points.push({ x, y: span.y });
      }
    }
  }
  return points;
};

export { spanOutline };
