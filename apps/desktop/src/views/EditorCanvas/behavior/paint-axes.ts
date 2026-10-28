/* @layer renderer-app @kind logic */
import type { Symmetry } from '@bxel/raster';
import type { PixelView } from '../../PixelViewport';
import { AXIS_DASH, AXIS_GRIP } from '../EditorCanvas.constants';
import type { AxisShown, OverlayLook } from './canvas-tools.type';

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

const paintLines = (ctx: CanvasRenderingContext2D, view: PixelView, shown: AxisShown): void => {
  if (shown.x !== null) {
    ctx.moveTo(shown.x / 2, 0);
    ctx.lineTo(shown.x / 2, view.imageHeight);
  }
  if (shown.y !== null) {
    ctx.moveTo(0, shown.y / 2);
    ctx.lineTo(view.imageWidth, shown.y / 2);
  }
};

const paintGrips = (ctx: CanvasRenderingContext2D, view: PixelView, shown: AxisShown): void => {
  const grip = AXIS_GRIP / view.zoom;
  if (shown.x !== null) {
    ctx.fillRect(shown.x / 2 - grip / 2, 0, grip, grip);
    ctx.fillRect(shown.x / 2 - grip / 2, view.imageHeight - grip, grip, grip);
  }
  if (shown.y !== null) {
    ctx.fillRect(0, shown.y / 2 - grip / 2, grip, grip);
    ctx.fillRect(view.imageWidth - grip, shown.y / 2 - grip / 2, grip, grip);
  }
};

const paintAxes = (ctx: CanvasRenderingContext2D, view: PixelView, symmetry: Symmetry, look: OverlayLook): void => {
  const shown = {
    x: typeof symmetry.x2 === 'number' && symmetry.mirrorX !== false ? symmetry.x2 : null,
    y: typeof symmetry.y2 === 'number' && symmetry.mirrorY !== false ? symmetry.y2 : null,
  };
  ctx.save();
  ctx.strokeStyle = look.axis;
  ctx.fillStyle = look.axis;
  ctx.lineWidth = 1 / view.zoom;
  ctx.setLineDash(AXIS_DASH.map((part) => part / view.zoom));
  ctx.beginPath();
  paintLines(ctx, view, shown);
  paintCrossing(ctx, view, symmetry);
  ctx.stroke();
  paintGrips(ctx, view, shown);
  ctx.restore();
};

export { paintAxes };
