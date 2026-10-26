/* @layer renderer-app @kind logic */
import { strokeCross } from '../../../../../canvas-look/stroke-cross';
import { atlasExtent } from '../../../../../sheet-manager/atlas-extent';
import { atlasPivotSpot } from '../../../../../sheet-manager/atlas-pivot-spot';
import type { AtlasItem } from '../../../../../sheet-manager/manager.type';
import type { AtlasDraw } from '../AtlasView.type';
import { canvasTone } from './canvas-tone';

const outline = (ctx: CanvasRenderingContext2D, item: AtlasItem, scale: number, width: number): void => {
  const extent = atlasExtent(item);
  ctx.lineWidth = width;
  ctx.strokeRect(item.x * scale + width / 2, item.y * scale + width / 2, extent.width * scale - width, extent.height * scale - width);
};

const cross = (ctx: CanvasRenderingContext2D, item: AtlasItem, scale: number): void => {
  const spot = atlasPivotSpot(item);
  ctx.lineWidth = 1;
  strokeCross(ctx, spot.x * scale, spot.y * scale, Math.max(3, scale));
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
