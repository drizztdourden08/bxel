/* @layer renderer-app @kind logic */
import { PREVIEW_INSET } from './canvas-look.constants';
import type { CanvasLook } from './canvas-look.type';
import { checkerTile } from './checker-tile';
import { dprOf } from './dpr-of';
import { fillTiled } from './fill-tiled';
import { fitCanvas } from './fit-canvas';
import { surroundTile } from './surround-tile';

const paintSurroundPreview = (canvas: HTMLCanvasElement, look: CanvasLook): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx) return;
  const dpr = dprOf(canvas);
  fillTiled(ctx, surroundTile(canvas.ownerDocument, look, dpr), { x: 0, y: 0, width: canvas.width, height: canvas.height });
  const width = Math.round(canvas.width * PREVIEW_INSET.width);
  const height = Math.round(canvas.height * PREVIEW_INSET.height);
  const x = Math.round((canvas.width - width) / 2);
  const y = Math.round((canvas.height - height) / 2);
  fillTiled(ctx, checkerTile(canvas.ownerDocument, look, dpr), { x, y, width, height });
};

export { paintSurroundPreview };
