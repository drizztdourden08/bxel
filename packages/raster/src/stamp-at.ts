/* @layer core @kind logic */
import type { BrushStamp } from './brush.type';
import type { Point } from './geometry.type';
import type { PixelWriter } from './paint.type';
import { writePixel } from './write-pixel';

const stampAt = (writer: PixelWriter, stamp: BrushStamp, point: Point): void => {
  const { size, offset, cells } = stamp;
  const left = point.x - offset;
  const top = point.y - offset;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (cells[row * size + col]) {
        writePixel(writer, left + col, top + row);
      }
    }
  }
};

export { stampAt };
