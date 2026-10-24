/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';

const lineCells = (from: Point, to: Point): Point[] => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const stepX = from.x < to.x ? 1 : -1;
  const stepY = from.y < to.y ? 1 : -1;
  const cells: Point[] = [];
  let x = from.x;
  let y = from.y;
  let error = dx - dy;
  for (;;) {
    cells.push({ x, y });
    if (x === to.x && y === to.y) return cells;
    const doubled = error * 2;
    if (doubled > -dy) {
      error -= dy;
      x += stepX;
    }
    if (doubled < dx) {
      error += dx;
      y += stepY;
    }
  }
};

export { lineCells };
