/* @layer core @kind logic */
import type { BrushStamp } from './brush.type';
import type { Point } from './geometry.type';
import type { PixelWriter } from './paint.type';
import { stampRow } from './stamp-row';
import { writePixel } from './write-pixel';

const stampMasked = (writer: PixelWriter, stamp: BrushStamp, left: number, top: number): void => {
  const { size, cells } = stamp;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (cells[row * size + col]) {
        writePixel(writer, left + col, top + row);
      }
    }
  }
};

const stampAt = (writer: PixelWriter, stamp: BrushStamp, point: Point): void => {
  const left = point.x - stamp.offset;
  const top = point.y - stamp.offset;
  if (writer.mask) {
    stampMasked(writer, stamp, left, top);
    return;
  }
  const first = Math.max(0, -top);
  const last = Math.min(stamp.size, writer.target.height - top);
  for (let row = first; row < last; row++) {
    stampRow(writer, stamp, { left, top }, row);
  }
};

export { stampAt };
