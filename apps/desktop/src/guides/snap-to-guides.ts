/* @layer renderer-app @kind logic */
import { GUIDE_SNAP_REACH } from './guide.constants';
import type { SnapRequest } from './snap-to-guides.type';

const lineNear = (position: number, lines: readonly number[], zoom: number): number | null => {
  const near = lines.filter((line) => Math.abs(line - position) * zoom <= GUIDE_SNAP_REACH);
  const best = near.sort((a, b) => Math.abs(a - position) - Math.abs(b - position))[0];
  return best ?? null;
};

const edgeOf = (line: number | null, pixel: number, from: number | null): number => {
  if (line === null) return pixel;
  return from !== null && pixel >= from ? line - 1 : line;
};

const snapToGuides = (raw: { x: number; y: number }, at: { x: number; y: number }, request: SnapRequest): { x: number; y: number } => {
  const { lines, zoom, from } = request;
  if (!lines) return at;
  return {
    x: edgeOf(lineNear(raw.x, lines.x, zoom), at.x, from?.x ?? null),
    y: edgeOf(lineNear(raw.y, lines.y, zoom), at.y, from?.y ?? null),
  };
};

export { snapToGuides };
