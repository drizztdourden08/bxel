/* @layer core @kind logic */
import type { BufferView } from './buffer.type';
import { foldPoint } from './fold-point';
import { growBounds } from './grow-bounds';
import { maskAllows } from './mask-allows';
import type { PixelWriter } from './paint.type';

const insideBuffer = (target: BufferView, x: number, y: number): boolean => x >= 0 && y >= 0 && x < target.width && y < target.height;

const claimOnce = (writer: PixelWriter, offset: number): boolean => {
  if (!writer.once) return true;
  if (writer.once[offset] === 1) return false;
  writer.once[offset] = 1;
  return true;
};

const writePixel = (writer: PixelWriter, rawX: number, rawY: number, paint: number = writer.index): void => {
  const { target } = writer;
  const { x, y } = foldPoint({ x: rawX, y: rawY }, target, writer.wrap);
  if (!insideBuffer(target, x, y) || !maskAllows(writer.mask, x, y)) return;
  const offset = y * target.width + x;
  const current = target.pixels[offset] ?? 0;
  if (!claimOnce(writer, offset)) return;
  const value = writer.ink ? writer.ink.apply(current, x, y, paint) : paint;
  if (value === null || current === value) return;
  target.pixels[offset] = value;
  growBounds(writer.bounds, x, y);
};

export { writePixel };
