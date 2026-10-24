/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { LABEL_MIN_ZOOM, LABEL_SIZE, OVERLAP_ALPHA } from '../SheetCanvas.constants';
import type { SheetLook, SheetPaintState } from '../SheetCanvas.type';

const paintFrames = (ctx: CanvasRenderingContext2D, view: PixelView, state: SheetPaintState, look: SheetLook): void => {
  const { zoom } = view;
  ctx.save();
  ctx.lineWidth = 1 / zoom;
  ctx.strokeStyle = look.frame;
  for (const { sprite, at } of state.model.items) ctx.strokeRect(at.x, at.y, sprite.width, sprite.height);
  ctx.globalAlpha = OVERLAP_ALPHA;
  ctx.fillStyle = look.overlap;
  const byId = new Map(state.model.items.map((item) => [item.sprite.id, item] as const));
  for (const { first, second } of state.model.overlaps) {
    const one = byId.get(first);
    const two = byId.get(second);
    if (!one || !two) continue;
    const left = Math.max(one.at.x, two.at.x);
    const top = Math.max(one.at.y, two.at.y);
    ctx.fillRect(left, top, Math.min(one.at.x + one.sprite.width, two.at.x + two.sprite.width) - left, Math.min(one.at.y + one.sprite.height, two.at.y + two.sprite.height) - top);
  }
  ctx.globalAlpha = 1;
  if (zoom >= LABEL_MIN_ZOOM) {
    ctx.fillStyle = look.label;
    ctx.font = `${LABEL_SIZE / zoom}px sans-serif`;
    for (const { sprite, at } of state.model.items) {
      const above = at.y * zoom >= LABEL_SIZE + 2;
      ctx.textBaseline = above ? 'bottom' : 'top';
      ctx.fillText(sprite.name, at.x, above ? at.y - 1 / zoom : at.y + 1 / zoom);
    }
  }
  ctx.restore();
};

export { paintFrames };
