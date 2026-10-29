/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/document';

const clampBy = (by: Point, rect: Rect, size: { columns: number; rows: number }): Point => ({
  x: Math.min(Math.max(by.x, -rect.x), size.columns - rect.x - rect.width),
  y: Math.min(Math.max(by.y, -rect.y), size.rows - rect.y - rect.height),
});

export { clampBy };
