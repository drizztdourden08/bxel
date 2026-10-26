/* @layer renderer-app @kind logic */
import { IMPORT_TEXT } from './image-import.constants';
import type { SliceRect } from './image-import.type';

const stripLine = (rects: readonly SliceRect[]): string => {
  const [first] = rects;
  return IMPORT_TEXT.stripFrames(rects.length, first?.width ?? 0, first?.height ?? 0);
};

export { stripLine };
