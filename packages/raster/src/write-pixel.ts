/* @layer core @kind logic */
import { foldPoint } from './fold-point';
import { growBounds } from './grow-bounds';
import { maskAllows } from './mask-allows';
import type { PixelWriter } from './paint.type';

const writePixel = (writer: PixelWriter, rawX: number, rawY: number, paint: number = writer.index): void => {
  const { target } = writer;
  const { x, y } = foldPoint({ x: rawX, y: rawY }, target, writer.wrap);
  if (x < 0 || y < 0 || x >= target.width || y >= target.height) {
    return;
  }
  if (!maskAllows(writer.mask, x, y)) {
    return;
  }
  const offset = y * target.width + x;
  const current = target.pixels[offset] ?? 0;
  if (writer.once) {
    if (writer.once[offset] === 1) {
      return;
    }
    writer.once[offset] = 1;
  }
  const value = writer.ink ? writer.ink.apply(current, x, y, paint) : paint;
  if (value === null || current === value) {
    return;
  }
  target.pixels[offset] = value;
  growBounds(writer.bounds, x, y);
};

export { writePixel };
