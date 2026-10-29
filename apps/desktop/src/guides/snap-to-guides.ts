/* @layer renderer-app @kind logic */
import { nearestLine } from './nearest-line';
import type { SnapRequest } from './snap-to-guides.type';

const edgeOf = (line: number | null, pixel: number, from: number | null): number => {
  if (line === null) return pixel;
  return from !== null && pixel >= from ? line - 1 : line;
};

const snapToGuides = (raw: { x: number; y: number }, at: { x: number; y: number }, request: SnapRequest): { x: number; y: number } => {
  const { lines, zoom, from } = request;
  if (!lines) return at;
  return {
    x: edgeOf(nearestLine(raw.x, lines.x, zoom), at.x, from?.x ?? null),
    y: edgeOf(nearestLine(raw.y, lines.y, zoom), at.y, from?.y ?? null),
  };
};

export { snapToGuides };
