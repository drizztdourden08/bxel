/* @layer core @kind logic */
import type { Point, Size } from '../model/geometry.type';
import type { GridLayout } from './grid-layout.type';
import type { SheetGap } from './sheet-gap.type';

const spanOf = (length: number, cell: number, gap: number): number => Math.max(1, Math.ceil((length + gap) / (Math.max(1, cell) + gap)));

const gridAnimationPoints = (layout: GridLayout, spriteCount: number, boxes: readonly Size[], gap: SheetGap): Point[] => {
  const { spacing, margin } = gap;
  let column = 0;
  let row = Math.ceil(spriteCount / layout.columns);
  let line = 1;
  return boxes.map((box) => {
    const across = spanOf(box.width, layout.cellWidth, spacing.x);
    if (column > 0 && column + across > layout.columns) {
      row += line;
      column = 0;
      line = 1;
    }
    const point = { x: margin + column * (layout.cellWidth + spacing.x), y: margin + row * (layout.cellHeight + spacing.y) };
    column += across;
    line = Math.max(line, spanOf(box.height, layout.cellHeight, spacing.y));
    return point;
  });
};

export { gridAnimationPoints };
