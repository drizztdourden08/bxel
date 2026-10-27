/* @layer core @kind logic */
import type { Point, Size } from '../model/geometry.type';
import type { GridLayout } from './grid-layout.type';

const spanOf = (length: number, cell: number, gap: number): number => Math.max(1, Math.ceil((length + gap) / (Math.max(1, cell) + gap)));

/**
 * Places animation strips on the cells of a grid, under the sprites. Each strip spans as many
 * cells as its box needs and the strips flow along the rows like words, so they never overlap.
 */
const gridAnimationPoints = (layout: GridLayout, spriteCount: number, boxes: readonly Size[], spacing: Point, margin: number): Point[] => {
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
