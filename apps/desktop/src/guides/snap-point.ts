/* @layer renderer-app @kind logic */
import { nearestLine } from './nearest-line';

const snapPoint = (raw: { x: number; y: number }, request: { lines: { x: readonly number[]; y: readonly number[] } | undefined; zoom: number }): { x: number; y: number } => {
  const { lines, zoom } = request;
  if (!lines) return raw;
  return { x: nearestLine(raw.x, lines.x, zoom) ?? raw.x, y: nearestLine(raw.y, lines.y, zoom) ?? raw.y };
};

export { snapPoint };
