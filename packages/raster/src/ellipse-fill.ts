/* @layer core @kind logic */
import { ellipseOutline } from './ellipse-outline';
import type { Corners, Span } from './geometry.type';
import { normalizeCorners } from './normalize-corners';

const ellipseFill = (corners: Corners): Span[] => {
  const { x0, y0, x1, y1 } = normalizeCorners(corners);
  const rows = y1 - y0 + 1;
  const lefts = new Int32Array(rows).fill(x1 + 1);
  const rights = new Int32Array(rows).fill(x0 - 1);
  for (const point of ellipseOutline(corners)) {
    const row = point.y - y0;
    lefts[row] = Math.min(lefts[row] ?? 0, point.x);
    rights[row] = Math.max(rights[row] ?? 0, point.x);
  }
  const spans: Span[] = [];
  for (let row = 0; row < rows; row++) {
    spans.push({ y: y0 + row, x0: lefts[row] ?? 0, x1: rights[row] ?? 0 });
  }
  return spans.filter((span) => span.x1 >= span.x0);
};

export { ellipseFill };
