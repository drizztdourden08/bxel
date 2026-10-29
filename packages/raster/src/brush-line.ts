/* @layer core @kind logic */
import type { BrushAngle } from './brush.type';
import { stampOffset } from './stamp-offset';

const DIRECTION: Readonly<Record<BrushAngle, readonly [number, number]>> = { 0: [1, 0], 45: [1, -1], 90: [0, 1], 135: [1, 1] };

/** A one pixel line through the centre of the stamp, so the brush covers a line of `size` cells at the angle. */
const fillLine = (cells: Uint8Array, size: number, angle: BrushAngle): void => {
  const middle = stampOffset(size);
  const [across, down] = DIRECTION[angle];
  for (let step = -size; step <= size; step++) {
    const col = middle + step * across;
    const row = middle + step * down;
    if (col >= 0 && col < size && row >= 0 && row < size) cells[row * size + col] = 1;
  }
};

export { fillLine };
