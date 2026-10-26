/* @layer renderer-app @kind logic */
import type { ImportForm, SliceRect, SourceImage } from './image-import.type';
import { sliceRects } from './slice-rects';

const active = (image: SourceImage): SliceRect[] => [{ index: 0, x: 0, y: 0, width: image.width, height: image.height }];

const activeRects = (form: ImportForm, image: SourceImage): SliceRect[] =>
  form.kind === 'sheet' || form.kind === 'strip' ? sliceRects(image, form.slice) : active(image);

export { activeRects };
