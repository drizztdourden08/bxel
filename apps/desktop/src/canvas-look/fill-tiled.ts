/* @layer renderer-app @kind logic */
import type { TileRect } from './canvas-look.type';

const fillTiled = (ctx: CanvasRenderingContext2D, tile: HTMLCanvasElement, rect: TileRect): void => {
  const pattern = ctx.createPattern(tile, 'repeat');
  if (!pattern) return;
  ctx.setTransform(1, 0, 0, 1, rect.x, rect.y);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

export { fillTiled };
