/* @layer renderer-app @kind logic */
import { dprOf } from './dpr-of';

const fitCanvas = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
  const dpr = dprOf(canvas);
  const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
};

export { fitCanvas };
