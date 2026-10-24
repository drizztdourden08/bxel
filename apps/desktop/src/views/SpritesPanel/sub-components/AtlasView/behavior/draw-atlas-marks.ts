/* @layer renderer-app @kind logic */
import type { AtlasItem } from '../../../../../sheet-manager/manager.type';
import type { AtlasDraw } from '../AtlasView.type';
import { canvasTone } from './canvas-tone';

const outline = (ctx: CanvasRenderingContext2D, item: AtlasItem, scale: number, width: number): void => {
  ctx.lineWidth = width;
  ctx.strokeRect(item.x * scale + width / 2, item.y * scale + width / 2, item.width * scale - width, item.height * scale - width);
};

const cross = (ctx: CanvasRenderingContext2D, item: AtlasItem, scale: number): void => {
  const x = (item.x + item.pivot.x2 / 2) * scale;
  const y = (item.y + item.pivot.y2 / 2) * scale;
  const arm = Math.max(3, scale);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - arm, y);
  ctx.lineTo(x + arm, y);
  ctx.moveTo(x, y - arm);
  ctx.lineTo(x, y + arm);
  ctx.stroke();
};

const drawAtlasMarks = (canvas: HTMLCanvasElement, view: AtlasDraw): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { atlas, scale, bounds, pivots, selected } = view;
  for (const item of atlas.items) {
    if (bounds) {
      ctx.strokeStyle = canvasTone(canvas, '--c-border');
      outline(ctx, item, scale, 1);
    }
    if (selected.has(item.id)) {
      ctx.strokeStyle = canvasTone(canvas, '--c-primary-bright');
      outline(ctx, item, scale, 2);
    }
    if (pivots) {
      ctx.strokeStyle = canvasTone(canvas, '--c-danger');
      cross(ctx, item, scale);
    }
  }
};

export { drawAtlasMarks };
