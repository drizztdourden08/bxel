/* @layer renderer-app @kind logic */
import type { Slice } from '@bxel/document';
import type { CentreEdge } from './centre-edge.type';
import { SLICE_HANDLE_REACH } from './slice.constants';

const centreEdgeAt = (slice: Slice, raw: { x: number; y: number }, zoom: number): CentreEdge | null => {
  const { center, rect } = slice;
  if (!center) return null;
  const reach = SLICE_HANDLE_REACH / zoom;
  const left = rect.x + center.x;
  const right = left + center.width;
  const top = rect.y + center.y;
  const bottom = top + center.height;
  const along = (value: number, low: number, high: number): boolean => value >= low - reach && value <= high + reach;
  const found: { edge: CentreEdge; gap: number }[] = [];
  if (along(raw.y, top, bottom)) found.push({ edge: 'left', gap: Math.abs(raw.x - left) }, { edge: 'right', gap: Math.abs(raw.x - right) });
  if (along(raw.x, left, right)) found.push({ edge: 'top', gap: Math.abs(raw.y - top) }, { edge: 'bottom', gap: Math.abs(raw.y - bottom) });
  const near = found.filter((candidate) => candidate.gap <= reach).sort((a, b) => a.gap - b.gap);
  return near[0]?.edge ?? null;
};

export { centreEdgeAt };
