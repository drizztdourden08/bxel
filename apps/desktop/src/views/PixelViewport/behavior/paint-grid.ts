/* @layer renderer-app @kind logic */
import type { GridAxis, ImageSize, PlacedImage } from './viewport.type';

const linesOf = (axis: GridAxis): number[] => {
  const first = Math.max(0, Math.ceil(-axis.start / axis.scale));
  const last = Math.min(axis.count, Math.floor((axis.room - axis.start) / axis.scale));
  const lines: number[] = [];
  for (let at = first; at <= last; at += 1) lines.push(Math.round(axis.start + at * axis.scale) + 0.5);
  return lines;
};

const paintGrid = (ctx: CanvasRenderingContext2D, placed: PlacedImage, image: ImageSize, colour: string): void => {
  const { canvas } = ctx;
  const top = Math.max(0, placed.y);
  const bottom = Math.min(canvas.height, placed.y + placed.height);
  const left = Math.max(0, placed.x);
  const right = Math.min(canvas.width, placed.x + placed.width);
  ctx.beginPath();
  linesOf({ start: placed.x, scale: placed.scale, count: image.width, room: canvas.width }).forEach((x) => {
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
  });
  linesOf({ start: placed.y, scale: placed.scale, count: image.height, room: canvas.height }).forEach((y) => {
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
  });
  ctx.lineWidth = 1;
  ctx.strokeStyle = colour;
  ctx.stroke();
};

export { paintGrid };
