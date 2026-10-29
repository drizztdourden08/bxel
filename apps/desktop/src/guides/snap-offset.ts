/* @layer renderer-app @kind logic */
import { nearestLine } from './nearest-line';

const pull = (start: number, size: number, lines: readonly number[], zoom: number): number => {
  const left = nearestLine(start, lines, zoom);
  const right = nearestLine(start + size, lines, zoom);
  if (left === null && right === null) return 0;
  const toLeft = left === null ? Number.POSITIVE_INFINITY : left - start;
  const toRight = right === null ? Number.POSITIVE_INFINITY : right - (start + size);
  return Math.abs(toLeft) <= Math.abs(toRight) ? toLeft : toRight;
};

const snapOffset = (box: { x: number; y: number; width: number; height: number }, offset: { x: number; y: number }, request: { lines: { x: readonly number[]; y: readonly number[] } | undefined; zoom: number }): { x: number; y: number } => {
  const { lines, zoom } = request;
  if (!lines) return offset;
  return {
    x: offset.x + pull(box.x + offset.x, box.width, lines.x, zoom),
    y: offset.y + pull(box.y + offset.y, box.height, lines.y, zoom),
  };
};

export { snapOffset };
