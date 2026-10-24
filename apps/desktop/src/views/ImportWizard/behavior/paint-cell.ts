/* @layer renderer-app @kind logic */
import type { SliceRect } from '../../../image-import/image-import.type';
import { SLICE_PAINT } from '../ImportWizard.constants';
import type { SliceLook } from '../ImportWizard.type';

const paintCell = (ctx: CanvasRenderingContext2D, rect: SliceRect, scale: number, look: SliceLook): void => {
  const x = rect.x * scale;
  const y = rect.y * scale;
  const width = rect.width * scale;
  const height = rect.height * scale;
  const font = Math.min(SLICE_PAINT.maxFont, Math.max(SLICE_PAINT.minFont, Math.floor(Math.min(width, height) / SLICE_PAINT.fontShare)));
  ctx.strokeStyle = look.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, Math.max(1, width - 1), Math.max(1, height - 1));
  ctx.fillStyle = look.text;
  ctx.font = `${font}px sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(String(rect.index + 1), x + SLICE_PAINT.pad, y + SLICE_PAINT.pad, Math.max(1, width - SLICE_PAINT.pad));
};

export { paintCell };
