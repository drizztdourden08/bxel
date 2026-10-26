/* @layer renderer-app @kind logic */
import type { Animation, Point } from '@bxel/document';
import { ANCHOR_ARM } from '../EditorCanvas.constants';

const paintAnchor = (ctx: CanvasRenderingContext2D, animation: Animation, origin: Point, zoom: number): void => {
  const arm = ANCHOR_ARM / zoom;
  const x = origin.x + animation.anchor.x2 / 2;
  const y = origin.y + animation.anchor.y2 / 2;
  ctx.beginPath();
  ctx.moveTo(x - arm, y);
  ctx.lineTo(x + arm, y);
  ctx.moveTo(x, y - arm);
  ctx.lineTo(x, y + arm);
  ctx.stroke();
};

export { paintAnchor };
