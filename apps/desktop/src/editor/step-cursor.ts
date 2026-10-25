/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { ARROW_DELTAS } from './selection/selection.constants';
import type { CursorSize } from './step-cursor.type';

const within = (value: number, size: number): number => Math.max(0, Math.min(size - 1, value));

const stepCursor = (from: Point, key: string, size: CursorSize): Point | null => {
  const delta = ARROW_DELTAS[key];
  if (!delta) return null;
  return { x: within(from.x + delta.x, size.width), y: within(from.y + delta.y, size.height) };
};

export { stepCursor };
