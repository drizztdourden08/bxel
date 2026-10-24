/* @layer renderer-app @kind logic */
import type { Symmetry } from '@bxel/raster';
import type { PixelView } from '../../PixelViewport';
import { AXIS_DASH, AXIS_GRIP } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const paintAxes = (ctx: CanvasRenderingContext2D, view: PixelView, symmetry: Symmetry, look: OverlayLook): void => {
  const { zoom, imageWidth, imageHeight } = view;
  const grip = AXIS_GRIP / zoom;
  ctx.save();
  ctx.strokeStyle = look.axis;
  ctx.fillStyle = look.axis;
  ctx.lineWidth = 1 / zoom;
  ctx.setLineDash(AXIS_DASH.map((part) => part / zoom));
  ctx.beginPath();
  if (typeof symmetry.x2 === 'number') {
    ctx.moveTo(symmetry.x2 / 2, 0);
    ctx.lineTo(symmetry.x2 / 2, imageHeight);
  }
  if (typeof symmetry.y2 === 'number') {
    ctx.moveTo(0, symmetry.y2 / 2);
    ctx.lineTo(imageWidth, symmetry.y2 / 2);
  }
  ctx.stroke();
  if (typeof symmetry.x2 === 'number') {
    ctx.fillRect(symmetry.x2 / 2 - grip / 2, 0, grip, grip);
    ctx.fillRect(symmetry.x2 / 2 - grip / 2, imageHeight - grip, grip, grip);
  }
  if (typeof symmetry.y2 === 'number') {
    ctx.fillRect(0, symmetry.y2 / 2 - grip / 2, grip, grip);
    ctx.fillRect(imageWidth - grip, symmetry.y2 / 2 - grip / 2, grip, grip);
  }
  ctx.restore();
};

export { paintAxes };
