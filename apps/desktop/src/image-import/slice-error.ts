/* @layer renderer-app @kind logic */
import { sizeError } from '../sprite-name/size-error';
import { IMPORT_TEXT, MAX_IMPORT_SPRITES } from './image-import.constants';
import type { SliceForm } from './image-import.type';

const sliceError = (slice: SliceForm, count: number): string | null => {
  const size = sizeError(slice.cellWidth, slice.cellHeight);
  if (size !== null) return size;
  const spans = [slice.offsetX, slice.offsetY, slice.spacingX, slice.spacingY];
  if (spans.some((value) => !Number.isInteger(value) || value < 0)) return IMPORT_TEXT.negative;
  if (count === 0) return IMPORT_TEXT.noCells;
  return count > MAX_IMPORT_SPRITES ? IMPORT_TEXT.tooManyCells : null;
};

export { sliceError };
