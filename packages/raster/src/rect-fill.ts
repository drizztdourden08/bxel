/* @layer core @kind logic */
import type { Corners, Span } from './geometry.type';
import { normalizeCorners } from './normalize-corners';

const rectFill = (corners: Corners): Span[] => {
  const { x0, y0, x1, y1 } = normalizeCorners(corners);
  const spans: Span[] = [];
  for (let y = y0; y <= y1; y++) {
    spans.push({ y, x0, x1 });
  }
  return spans;
};

export { rectFill };
