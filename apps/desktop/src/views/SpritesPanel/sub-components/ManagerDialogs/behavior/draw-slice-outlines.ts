/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';

const FALLBACK = 'currentColor';

const drawSliceOutlines = (ctx: CanvasRenderingContext2D, rects: readonly Rect[], scale: number): void => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = getComputedStyle(ctx.canvas).getPropertyValue('--c-danger').trim() || FALLBACK;
  for (const rect of rects) ctx.strokeRect(rect.x * scale + 0.5, rect.y * scale + 0.5, Math.max(1, rect.width * scale - 1), Math.max(1, rect.height * scale - 1));
};

export { drawSliceOutlines };
