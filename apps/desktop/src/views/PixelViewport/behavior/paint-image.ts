/* @layer renderer-app @kind logic */
import type { FrameInput, PaintTools } from './viewport.type';
import { drawableOf } from './drawable-of';

const paintImage = (args: PaintTools, frame: FrameInput): void => {
  const { ctx, placed, view, scratch } = args;
  ctx.save();
  ctx.setTransform(placed.scale, 0, 0, placed.scale, placed.x, placed.y);
  ctx.imageSmoothingEnabled = false;
  ctx.beginPath();
  ctx.rect(0, 0, frame.image.width, frame.image.height);
  ctx.clip();
  const drawable = frame.source ? drawableOf(frame.source, scratch) : null;
  if (drawable) ctx.drawImage(drawable, 0, 0);
  frame.draw?.(ctx, view);
  ctx.restore();
};

export { paintImage };
