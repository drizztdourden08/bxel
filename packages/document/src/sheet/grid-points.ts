/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';
import type { GridLayout } from './grid-layout.type';

const gridPoints = (layout: GridLayout, count: number, spacing: Point, margin: number): Point[] => {
  const rows = Math.max(1, Math.ceil(count / layout.columns));
  return Array.from({ length: count }, (_, index) => {
    const byRows = layout.order === 'rows';
    const column = byRows ? index % layout.columns : Math.floor(index / rows);
    const row = byRows ? Math.floor(index / layout.columns) : index % rows;
    return {
      x: margin + column * (layout.cellWidth + spacing.x),
      y: margin + row * (layout.cellHeight + spacing.y),
    };
  });
};

export { gridPoints };
