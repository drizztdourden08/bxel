/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';

interface StripHint {
  cells: number;
  columns: number;
  rows: number;
}

const MIN_CELLS = 2;

/** A sprite as wide as a whole number of its heights (or as tall as a whole number of its widths) looks like a strip of equal cells. */
const stripHint = (size: Size): StripHint | null => {
  const { width, height } = size;
  if (width > height && height > 0 && width % height === 0 && width / height >= MIN_CELLS) return { cells: width / height, columns: width / height, rows: 1 };
  if (height > width && width > 0 && height % width === 0 && height / width >= MIN_CELLS) return { cells: height / width, columns: 1, rows: height / width };
  return null;
};

export type { StripHint };
export { stripHint };
