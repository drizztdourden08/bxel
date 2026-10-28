/* @layer renderer-app @kind logic */
import type { Symmetry } from '@bxel/raster';
import type { PixelView } from '../../PixelViewport';
import { AXIS_DASH, AXIS_GRIP } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const paintCrossing = (ctx: CanvasRenderingContext2D, view: PixelView, symmetry: Symmetry): void => {
  if (typeof symmetry.x2 !== 'number' || typeof symmetry.y2 !== 'number') return;
  const centreX = symmetry.x2 / 2;
  const centreY = symmetry.y2 / 2;
  if (symmetry.diagonal === true) {
    const reach = Math.max(view.imageWidth, view.imageHeight);
    ctx.moveTo(centreX - reach, centreY - reach);
    ctx.lineTo(centreX + reach, centreY + reach);
  }
  if (symmetry.turn4 === true) {
    const arm = 3;
    ctx.moveTo(centreX - arm, centreY);
    ctx.lineTo(centreX + arm, centreY);
    ctx.moveTo(centreX, centreY - arm);
    ctx.lineTo(centreX, centreY + arm);
  }
};

const paintAxes = (ctx: CanvasRenderingContext2D, view: PixelView, symmetry: Symmetry, look: OverlayLook): void => {
  const { zoom, imageWidth, imageHeight } = view;
  const grip = AXIS_GRIP / zoom;
  const showX = typeof symmetry.x2 === 'number' && symmetry.mirrorX !== false;
  const showY = typeof symmetry.y2 === 'number' && symmetry.mirrorY !== false;
  ctx.save();
  ctx.strokeStyle = look.axis;
  ctx.fillStyle = look.axis;
  ctx.lineWidth = 1 / zoom;
  ctx.setLineDash(AXIS_DASH.map((part) => part / zoom));
  ctx.beginPath();
  if (showX && typeof symmetry.x2 === 'number') {
    ctx.moveTo(symmetry.x2 / 2, 0);
    ctx.lineTo(symmetry.x2 / 2, imageHeight);
  }
  if (showY && typeof symmetry.y2 === 'number') {
    ctx.moveTo(0, symmetry.y2 / 2);
    ctx.lineTo(imageWidth, symmetry.y2 / 2);
  }
  paintCrossing(ctx, view, symmetry);
  ctx.stroke();
  if (showX && typeof symmetry.x2 === 'number') {
    ctx.fillRect(symmetry.x2 / 2 - grip / 2, 0, grip, grip);
    ctx.fillRect(symmetry.x2 / 2 - grip / 2, imageHeight - grip, grip, grip);
  }
  if (showY && typeof symmetry.y2 === 'number') {
    ctx.fillRect(0, symmetry.y2 / 2 - grip / 2, grip, grip);
    ctx.fillRect(imageWidth - grip, symmetry.y2 / 2 - grip / 2, grip, grip);
  }
  ctx.restore();
};

export { paintAxes };
