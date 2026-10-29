/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';
import { OVERLAP_ALPHA, OVERLAP_OUTLINE } from '../SheetCanvas.constants';
import type { SheetLook, SheetPaintState } from '../SheetCanvas.type';
import { partRect } from './part-rect';

const shade = (ctx: CanvasRenderingContext2D, one: Rect, two: Rect): void => {
  const left = Math.max(one.x, two.x);
  const top = Math.max(one.y, two.y);
  ctx.fillRect(left, top, Math.min(one.x + one.width, two.x + two.width) - left, Math.min(one.y + one.height, two.y + two.height) - top);
};

const paintOverlaps = (ctx: CanvasRenderingContext2D, state: SheetPaintState, look: SheetLook): void => {
  if (!state.marks.overlaps) return;
  ctx.fillStyle = look.overlap;
  ctx.strokeStyle = look.overlap;
  const width = ctx.lineWidth;
  for (const { first, second } of state.model.overlaps) {
    const one = partRect(state.model, first);
    const two = partRect(state.model, second);
    if (!one || !two) continue;
    ctx.globalAlpha = OVERLAP_ALPHA;
    shade(ctx, one, two);
    ctx.globalAlpha = 1;
    ctx.lineWidth = width * OVERLAP_OUTLINE;
    ctx.strokeRect(one.x, one.y, one.width, one.height);
    ctx.strokeRect(two.x, two.y, two.width, two.height);
  }
  ctx.lineWidth = width;
};

export { paintOverlaps };
