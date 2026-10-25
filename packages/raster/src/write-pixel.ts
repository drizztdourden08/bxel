/* @layer core @kind logic */
import { foldPoint } from './fold-point';
import { growBounds } from './grow-bounds';
import { maskAllows } from './mask-allows';
import type { PixelWriter } from './paint.type';

const writePixel = (writer: PixelWriter, rawX: number, rawY: number): void => {
  const { target } = writer;
  const { x, y } = foldPoint({ x: rawX, y: rawY }, target, writer.wrap);
  if (x < 0 || y < 0 || x >= target.width || y >= target.height) {
    return;
  }
  if (!maskAllows(writer.mask, x, y)) {
    return;
  }
  const offset = y * target.width + x;
  if (target.pixels[offset] === writer.index) {
    return;
  }
  target.pixels[offset] = writer.index;
  growBounds(writer.bounds, x, y);
};

export { writePixel };
