/* @layer renderer-app @kind logic */
import type { ImportRun, SheetLayoutPlan } from './image-import.type';

const sheetLayoutOf = (run: ImportRun): SheetLayoutPlan => {
  const { slice } = run.form;
  if (slice.offsetX !== slice.offsetY) return { layout: { kind: 'manual' }, spacing: { x: 0, y: 0 }, margin: 0 };
  return {
    layout: {
      kind: 'grid',
      columns: Math.max(1, new Set(run.rects.map((rect) => rect.x)).size),
      cellWidth: slice.cellWidth,
      cellHeight: slice.cellHeight,
      order: slice.order,
    },
    spacing: { x: slice.spacingX, y: slice.spacingY },
    margin: slice.offsetX,
  };
};

export { sheetLayoutOf };
