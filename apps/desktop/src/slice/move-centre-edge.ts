/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';
import type { CentreEdge } from './centre-edge.type';

const clamp = (value: number, low: number, high: number): number => Math.max(low, Math.min(high, value));

const moveCentreEdge = (centre: Rect, edge: CentreEdge, point: { x: number; y: number }, slice: Rect): Rect => {
  const x = Math.round(point.x - slice.x);
  const y = Math.round(point.y - slice.y);
  if (edge === 'left') {
    const left = clamp(x, 0, centre.x + centre.width - 1);
    return { ...centre, x: left, width: centre.x + centre.width - left };
  }
  if (edge === 'right') return { ...centre, width: clamp(x, centre.x + 1, slice.width) - centre.x };
  if (edge === 'top') {
    const top = clamp(y, 0, centre.y + centre.height - 1);
    return { ...centre, y: top, height: centre.y + centre.height - top };
  }
  return { ...centre, height: clamp(y, centre.y + 1, slice.height) - centre.y };
};

export { moveCentreEdge };
