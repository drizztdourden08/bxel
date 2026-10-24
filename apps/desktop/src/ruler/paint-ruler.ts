/* @layer renderer-app @kind logic */
import { fitCanvas } from '../canvas-look/fit-canvas';
import type { RulerPlan } from './ruler.type';
import { paintCursorMark } from './paint-cursor-mark';
import { paintHandleMark } from './paint-handle-mark';
import { paintRulerTicks } from './paint-ruler-ticks';
import { rulerLook } from './ruler-look';

const paintRuler = (canvas: HTMLCanvasElement, plan: RulerPlan): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx) return;
  const scale = canvas.width / Math.max(1, canvas.clientWidth);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const horizontal = plan.axis === 'x';
  const frame = {
    ctx,
    axis: plan.axis,
    length: horizontal ? canvas.clientWidth : canvas.clientHeight,
    thickness: horizontal ? canvas.clientHeight : canvas.clientWidth,
    look: rulerLook(canvas),
  };
  paintRulerTicks(frame, plan.span);
  if (plan.cursor !== null) paintCursorMark(frame, plan.span, plan.cursor);
  if (plan.handle !== null) paintHandleMark(frame, plan.span, plan.handle);
};

export { paintRuler };
