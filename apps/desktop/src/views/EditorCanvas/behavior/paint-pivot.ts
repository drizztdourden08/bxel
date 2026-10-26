/* @layer renderer-app @kind logic */
import type { Pivot2 } from '@bxel/document';
import type { PixelView } from '../../PixelViewport';
import { AXIS_DASH, AXIS_GRIP } from '../EditorCanvas.constants';
import type { PivotFrame } from './canvas-tools.type';

const paintPivot = (ctx: CanvasRenderingContext2D, view: PixelView, frame: PivotFrame, pivot: Pivot2): void => {
  const pixel = 1 / view.zoom;
  const x = frame.x + pivot.x2 / 2;
  const y = frame.y + pivot.y2 / 2;
  const grip = AXIS_GRIP * pixel;
  ctx.setLineDash(AXIS_DASH.map((part) => part * pixel));
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, view.imageHeight);
  ctx.moveTo(0, y);
  ctx.lineTo(view.imageWidth, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillRect(x - grip / 2, 0, grip, grip);
  ctx.fillRect(0, y - grip / 2, grip, grip);
};

export { paintPivot };
