/* @layer core @kind logic */
import type { BrushStamp } from './brush.type';
import type { PixelWriter } from './paint.type';

const stampRow = (writer: PixelWriter, stamp: BrushStamp, at: { readonly left: number; readonly top: number }, row: number): void => {
  const { target, index, bounds } = writer;
  const { pixels, width } = target;
  const from = Math.max(0, -at.left);
  const to = Math.min(stamp.size, width - at.left);
  const cellBase = row * stamp.size;
  const pixelBase = (at.top + row) * width + at.left;
  let first = Number.MAX_SAFE_INTEGER;
  let last = -1;
  for (let col = from; col < to; col++) {
    if (stamp.cells[cellBase + col] !== 0 && pixels[pixelBase + col] !== index) {
      pixels[pixelBase + col] = index;
      first = Math.min(first, col);
      last = col;
    }
  }
  if (last >= 0) {
    bounds.minX = Math.min(bounds.minX, at.left + first);
    bounds.maxX = Math.max(bounds.maxX, at.left + last);
    bounds.minY = Math.min(bounds.minY, at.top + row);
    bounds.maxY = Math.max(bounds.maxY, at.top + row);
  }
};

export { stampRow };
