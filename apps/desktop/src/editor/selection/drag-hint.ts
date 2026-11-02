/* @layer renderer-app @kind logic */
import type { CombineMode, Point } from '@bxel/raster';
import { marqueeRule } from './marquee-rule';
import { MODE_LABELS, SELECTION_TEXT } from './selection.constants';
import type { DragShape, ShapeHold } from './selection.type';
import type { Extent } from './drag-hint.type';
import { shapeCorners } from './shape-corners';

const extentOf = (points: readonly Point[]): Extent => {
  const xs = points.map((each) => each.x);
  const ys = points.map((each) => each.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x + 1, height: Math.max(...ys) - y + 1 };
};

const shapeExtent = (shape: DragShape, hold: ShapeHold): Extent => {
  if (shape.variant === 'lasso' || shape.variant === 'polygon') return extentOf(shape.path);
  const corners = shapeCorners(shape.from, shape.to, hold, marqueeRule());
  return extentOf([corners.from, corners.to]);
};

const dragHint = (shape: DragShape, mode: CombineMode, hold: ShapeHold): string => {
  const box = shapeExtent(shape, hold);
  return SELECTION_TEXT.dragReadout(MODE_LABELS[mode], box);
};

export { dragHint };
