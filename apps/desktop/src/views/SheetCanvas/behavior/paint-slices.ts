/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { SELECT_DASH } from '../SheetCanvas.constants';
import type { SheetLook, SheetPaintState } from '../SheetCanvas.type';
import { sliceBox } from './slice-box';

const paintSlices = (ctx: CanvasRenderingContext2D, view: PixelView, state: SheetPaintState, look: SheetLook): void => {
  const { zoom } = view;
  ctx.save();
  ctx.strokeStyle = look.slice;
  ctx.lineWidth = 1 / zoom;
  ctx.setLineDash(SELECT_DASH.map((part) => part / zoom));
  for (const { sprite, at } of state.model.items) {
    for (const slice of sprite.slices) ctx.strokeRect(at.x + slice.rect.x, at.y + slice.rect.y, slice.rect.width, slice.rect.height);
  }
  const drag = state.drag;
  if (drag?.kind === 'slice') {
    const box = sliceBox(drag.start, drag.end, drag.sprite);
    ctx.strokeRect(drag.origin.x + box.x, drag.origin.y + box.y, box.width, box.height);
  }
  ctx.restore();
};

export { paintSlices };
