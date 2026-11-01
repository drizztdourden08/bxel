/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { DragShape, ShapeHold } from './selection.type';

const nextShape = (shape: DragShape, at: Point, hold: ShapeHold): DragShape => {
  if (shape.variant !== 'lasso') return { ...shape, to: at };
  if (!hold.centre) return { ...shape, to: at, path: [...shape.path, at], anchor: null };
  const anchor = shape.anchor ?? shape.path.length - 1;
  return { ...shape, to: at, path: [...shape.path.slice(0, anchor + 1), at], anchor };
};

export { nextShape };
