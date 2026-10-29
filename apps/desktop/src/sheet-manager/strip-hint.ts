/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import { MIN_CELLS } from './strip-hint.constants';
import type { StripHint } from './strip-hint.type';

const stripHint = (size: Size): StripHint | null => {
  const { width, height } = size;
  if (width > height && height > 0 && width % height === 0 && width / height >= MIN_CELLS) return { cells: width / height, columns: width / height, rows: 1 };
  if (height > width && width > 0 && height % width === 0 && height / width >= MIN_CELLS) return { cells: height / width, columns: 1, rows: height / width };
  return null;
};

export { stripHint };
