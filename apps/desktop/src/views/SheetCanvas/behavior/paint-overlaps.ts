/* @layer renderer-app @kind logic */
import { OVERLAP_ALPHA } from '../SheetCanvas.constants';
import type { SheetLook, SheetPaintState } from '../SheetCanvas.type';

const paintOverlaps = (ctx: CanvasRenderingContext2D, state: SheetPaintState, look: SheetLook): void => {
  if (!state.marks.overlaps) return;
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
};

export { paintOverlaps };
