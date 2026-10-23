/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';

const copyNonZero = (target: Uint8Array, start: number, source: Uint8Array): void => {
  for (const [offset, value] of source.entries()) {
    if (value !== 0) target[start + offset] = value;
  }
};

const writeRect = ({
  target,
  stride,
  rect,
  pixels,
  skipZero,
}: {
  target: Uint8Array;
  stride: number;
  rect: Rect;
  pixels: Uint8Array;
  skipZero: boolean;
}): void => {
  for (let row = 0; row < rect.height; row += 1) {
    const source = pixels.subarray(row * rect.width, (row + 1) * rect.width);
    const start = (rect.y + row) * stride + rect.x;
    if (skipZero) copyNonZero(target, start, source);
    else target.set(source, start);
  }
};

export { writeRect };
