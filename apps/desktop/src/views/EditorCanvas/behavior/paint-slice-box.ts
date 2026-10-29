/* @layer renderer-app @kind logic */
import type { Slice } from '@bxel/document';
import type { PixelView } from '../../PixelViewport';
import { GRIP } from './paint-slice-box.constants';
import type { SliceBoxLook } from './paint-slice-box.type';

const paintSliceBox = (ctx: CanvasRenderingContext2D, view: PixelView, shown: SliceBoxLook): void => {
  const { slice, selected, look } = shown;
  const { rect } = slice;
  const line = 1 / view.zoom;
  ctx.save();
  ctx.strokeStyle = selected ? look.cursor : look.ink;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = selected ? 2 * line : line;
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  paintCentre(ctx, view, slice);
  if (slice.pivot) {
    const x = rect.x + slice.pivot.x2 / 2;
    const y = rect.y + slice.pivot.y2 / 2;
    const arm = 3 / view.zoom;
    ctx.lineWidth = line;
    ctx.beginPath();
    ctx.moveTo(x - arm, y);
    ctx.lineTo(x + arm, y);
    ctx.moveTo(x, y - arm);
    ctx.lineTo(x, y + arm);
    ctx.stroke();
  }
  if (slice.name !== '') {
    ctx.font = `${11 / view.zoom}px sans-serif`;
    ctx.fillText(slice.name, rect.x + 2 * line, rect.y - 3 * line);
  }
  if (selected) paintGrips(ctx, view, slice);
  ctx.restore();
};

const paintCentre = (ctx: CanvasRenderingContext2D, view: PixelView, slice: Slice): void => {
  const { center, rect } = slice;
  if (!center) return;
  ctx.save();
  ctx.setLineDash([3 / view.zoom, 2 / view.zoom]);
  ctx.lineWidth = 1 / view.zoom;
  ctx.strokeRect(rect.x + center.x, rect.y + center.y, center.width, center.height);
  ctx.restore();
};

const paintGrips = (ctx: CanvasRenderingContext2D, view: PixelView, slice: Slice): void => {
  const { rect } = slice;
  const size = (GRIP * 2) / view.zoom;
  for (const x of [rect.x, rect.x + rect.width / 2, rect.x + rect.width]) {
    for (const y of [rect.y, rect.y + rect.height / 2, rect.y + rect.height]) ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }
};

export { paintSliceBox };
