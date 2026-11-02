/* @layer renderer-app @kind logic */
import type { GuideStroke } from './stroke-guide.type';

const strokeGuide = (ctx: CanvasRenderingContext2D, { from, to, colour }: GuideStroke): void => {
  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(to[0], to[1]);
  ctx.stroke();
};

export { strokeGuide };
