/* @layer renderer-app @kind logic */
import type { CanvasLook } from './canvas-look.type';
import { dprOf } from './dpr-of';
import { fillTiled } from './fill-tiled';
import { fitCanvas } from './fit-canvas';
import { surroundTile } from './surround-tile';

const paintSurround = (canvas: HTMLCanvasElement, look: CanvasLook): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx) return;
  fillTiled(ctx, surroundTile(canvas.ownerDocument, look, dprOf(canvas)), { x: 0, y: 0, width: canvas.width, height: canvas.height });
};

export { paintSurround };
