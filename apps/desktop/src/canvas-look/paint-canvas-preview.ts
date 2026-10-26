/* @layer renderer-app @kind logic */
import { PREVIEW_SAMPLES } from './canvas-look.constants';
import type { CanvasLook } from './canvas-look.type';
import { checkerTile } from './checker-tile';
import { dprOf } from './dpr-of';
import { fillTiled } from './fill-tiled';
import { fitCanvas } from './fit-canvas';

const paintCanvasPreview = (canvas: HTMLCanvasElement, look: CanvasLook): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx) return;
  fillTiled(ctx, checkerTile(canvas.ownerDocument, look, dprOf(canvas)), { x: 0, y: 0, width: canvas.width, height: canvas.height });
  PREVIEW_SAMPLES.forEach((sample) => {
    ctx.globalAlpha = sample.alpha;
    ctx.fillStyle = sample.colour;
    ctx.fillRect(Math.round(canvas.width * sample.x), Math.round(canvas.height * sample.y), Math.round(canvas.width * sample.width), Math.round(canvas.height * sample.height));
  });
  ctx.globalAlpha = 1;
};

export { paintCanvasPreview };
