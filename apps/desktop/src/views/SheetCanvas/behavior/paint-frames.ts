/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { SheetLook, SheetPaintState } from '../SheetCanvas.type';
import { paintLabels } from './paint-labels';
import { paintOverlaps } from './paint-overlaps';

const paintFrames = (ctx: CanvasRenderingContext2D, view: PixelView, state: SheetPaintState, look: SheetLook): void => {
  const { zoom } = view;
  ctx.save();
  ctx.lineWidth = 1 / zoom;
  ctx.strokeStyle = look.frame;
  for (const { sprite, at } of state.model.items) ctx.strokeRect(at.x, at.y, sprite.width, sprite.height);
  paintOverlaps(ctx, state, look);
  paintLabels(ctx, zoom, state, look);
  ctx.restore();
};

export { paintFrames };
