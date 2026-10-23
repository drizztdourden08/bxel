/* @layer core @kind logic */
import { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN } from './brush.constants';
import type { Brush, BrushStamp } from './brush.type';
import { stampOffset } from './stamp-offset';

const clampSize = (size: number): number =>
  Math.min(BRUSH_SIZE_MAX, Math.max(BRUSH_SIZE_MIN, Math.trunc(size) || BRUSH_SIZE_MIN));

const insideCircle = (size: number, col: number, row: number): boolean => {
  const dx = 2 * col + 1 - size;
  const dy = 2 * row + 1 - size;
  return 2 * (dx * dx + dy * dy) <= 2 * size * size - size;
};

const fillCircle = (cells: Uint8Array, size: number): void => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      cells[row * size + col] = insideCircle(size, col, row) ? 1 : 0;
    }
  }
};

const brushStamp = (brush: Brush): BrushStamp => {
  const size = clampSize(brush.size);
  const cells = new Uint8Array(size * size);
  if (brush.shape === 'circle') {
    fillCircle(cells, size);
  } else {
    cells.fill(1);
  }
  return { size, offset: stampOffset(size), cells };
};

export { brushStamp };
