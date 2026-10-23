/* @layer renderer-app @kind logic */
import type { PlacedImage } from './viewport.type';

const paintChecker = (ctx: CanvasRenderingContext2D, placed: PlacedImage, tile: HTMLCanvasElement): void => {
  const pattern = ctx.createPattern(tile, 'repeat');
  if (!pattern) return;
  ctx.setTransform(1, 0, 0, 1, placed.x, placed.y);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, placed.width, placed.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

export { paintChecker };
