/* @layer core @kind logic */
import type { BrushAngle } from './brush.type';
import { DIRECTION } from './brush-line.constants';
import { stampOffset } from './stamp-offset';

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
