/* @layer renderer-app @kind logic */
import { PREVIEW_ZOOM } from './canvas-look.constants';
import type { CanvasLook, GridFlags, GridLine } from './canvas-look.type';
import { checkerTile } from './checker-tile';
import { dprOf } from './dpr-of';
import { fillTiled } from './fill-tiled';
import { fitCanvas } from './fit-canvas';
import { gridLayers } from './grid-layers';

const strokeLines = (ctx: CanvasRenderingContext2D, line: GridLine, scale: number): void => {
  const { width, height } = ctx.canvas;
  const gap = line.every * scale;
  ctx.beginPath();
  for (let x = gap; x < width; x += gap) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, height);
  }
  for (let y = gap; y < height; y += gap) {
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(width, Math.round(y) + 0.5);
  }
  ctx.globalAlpha = line.opacity;
  ctx.strokeStyle = line.colour;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;
};

const paintGridPreview = (canvas: HTMLCanvasElement, look: CanvasLook, flags: GridFlags): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx) return;
  const dpr = dprOf(canvas);
  fillTiled(ctx, checkerTile(canvas.ownerDocument, look, dpr), { x: 0, y: 0, width: canvas.width, height: canvas.height });
  gridLayers(look, flags, PREVIEW_ZOOM, 1).forEach((line) => strokeLines(ctx, line, PREVIEW_ZOOM * dpr));
};

export { paintGridPreview };
