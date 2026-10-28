/* @layer renderer-app @kind logic */
import { LABEL_MIN_ZOOM, LABEL_SIZE } from '../SheetCanvas.constants';
import type { SheetLook, SheetPaintState } from '../SheetCanvas.type';

const paintLabels = (ctx: CanvasRenderingContext2D, zoom: number, state: SheetPaintState, look: SheetLook): void => {
  if (!state.marks.labels || zoom < LABEL_MIN_ZOOM) return;
  ctx.fillStyle = look.label;
  ctx.font = `${LABEL_SIZE / zoom}px sans-serif`;
  for (const { sprite, at } of state.model.items) {
    const above = at.y * zoom >= LABEL_SIZE + 2;
    ctx.textBaseline = above ? 'bottom' : 'top';
    ctx.fillText(sprite.name, at.x, above ? at.y - 1 / zoom : at.y + 1 / zoom);
  }
};

export { paintLabels };
