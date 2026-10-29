/* @layer core @kind logic */
import type { Corners, Span } from './geometry.type';
import { normalizeCorners } from './normalize-corners';
import { RADIUS_MAX } from './rounded-rect.constants';

const cut = (radius: number, depth: number): number => {
  const rise = radius - depth - 0.5;
  return radius - Math.round(Math.sqrt(Math.max(0, radius * radius - rise * rise)));
};

const roundedRect = (corners: Corners, radius: number): Span[] => {
  const { x0, y0, x1, y1 } = normalizeCorners(corners);
  const reach = Math.min(Math.trunc(radius), RADIUS_MAX, Math.floor((x1 - x0 + 1) / 2), Math.floor((y1 - y0 + 1) / 2));
  const spans: Span[] = [];
  for (let y = y0; y <= y1; y++) {
    const depth = Math.min(y - y0, y1 - y);
    const inset = depth < reach ? cut(reach, depth) : 0;
    spans.push({ y, x0: x0 + inset, x1: x1 - inset });
  }
  return spans;
};

export { roundedRect };
