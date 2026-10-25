/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';
import { diffPair } from './diff-pair';
import { firstDiffIn } from './first-diff-in';
import { lastDiffIn } from './last-diff-in';

const diffBounds = (before: Uint8Array, after: Uint8Array, width: number): Rect | null => {
  const pair = diffPair(before, after);
  const first = firstDiffIn(pair, 0, after.length);
  if (first < 0) return null;
  const last = lastDiffIn(pair, first, after.length);
  const minY = Math.floor(first / width);
  const maxY = Math.floor(last / width);
  let minX = width;
  let maxX = -1;
  for (let y = minY; y <= maxY; y += 1) {
    const row = y * width;
    const left = firstDiffIn(pair, row, row + minX);
    if (left >= 0) minX = left - row;
    const right = lastDiffIn(pair, row + maxX + 1, row + width);
    if (right >= 0) maxX = right - row;
  }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

export { diffBounds };
