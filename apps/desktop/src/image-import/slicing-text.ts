/* @layer renderer-app @kind logic */
import { IMPORT_TEXT } from './image-import.constants';
import type { ImportKind, SliceRect } from './image-import.type';
import { slicingLine } from './slicing-line';
import { stripLine } from './strip-line';

const slicingText = (kind: ImportKind, names: readonly string[], rects: readonly SliceRect[]): string => {
  const [first] = rects;
  if (kind === 'strip') return stripLine(rects);
  if (kind === 'tileset') return IMPORT_TEXT.tilesetTiles(rects.length, first?.width ?? 0, first?.height ?? 0);
  return slicingLine(names);
};

export { slicingText };
