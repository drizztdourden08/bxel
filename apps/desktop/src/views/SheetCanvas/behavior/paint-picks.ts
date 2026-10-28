/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { PIVOT_ARM, SELECT_DASH } from '../SheetCanvas.constants';
import type { SheetLook, SheetPaintState } from '../SheetCanvas.type';

const paintPicks = (ctx: CanvasRenderingContext2D, view: PixelView, state: SheetPaintState, look: SheetLook): void => {
  const { zoom } = view;
  const moved = state.drag?.kind === 'move' ? state.drag : null;
  ctx.save();
  for (const { sprite, at } of state.model.items) {
    if (!state.selected.has(sprite.id)) continue;
    const active = sprite.id === state.active;
    const shift = moved?.ids.includes(sprite.id) ? moved.delta : { x: 0, y: 0 };
    const x = at.x + shift.x;
    const y = at.y + shift.y;
    ctx.strokeStyle = active ? look.active : look.selected;
    ctx.lineWidth = (active ? 2 : 1) / zoom;
    ctx.setLineDash(SELECT_DASH.map((part) => part / zoom));
    ctx.strokeRect(x, y, sprite.width, sprite.height);
    ctx.setLineDash([]);
    if (!state.marks.pivots) continue;
    ctx.strokeStyle = look.pivot;
    ctx.lineWidth = 1 / zoom;
    const px = x + sprite.pivot.x2 / 2;
    const py = y + sprite.pivot.y2 / 2;
    ctx.beginPath();
    ctx.moveTo(px - PIVOT_ARM / zoom, py);
    ctx.lineTo(px + PIVOT_ARM / zoom, py);
    ctx.moveTo(px, py - PIVOT_ARM / zoom);
    ctx.lineTo(px, py + PIVOT_ARM / zoom);
    ctx.stroke();
  }
  ctx.restore();
};

export { paintPicks };
