/* @layer renderer-app @kind logic */
import type { GridLine } from '../../../canvas-look/canvas-look.type';
import type { GridAxis, ImageSize, PlacedImage } from './viewport.type';

const linesOf = (axis: GridAxis): number[] => {
  const gap = axis.scale * axis.every;
  const first = Math.max(0, Math.ceil(-axis.start / gap));
  const last = Math.min(Math.floor(axis.count / axis.every), Math.floor((axis.room - axis.start) / gap));
  const lines: number[] = [];
  for (let at = first; at <= last; at += 1) lines.push(Math.round(axis.start + at * gap) + 0.5);
  return lines;
};

const paintGrid = (ctx: CanvasRenderingContext2D, placed: PlacedImage, image: ImageSize, line: GridLine): void => {
  const { canvas } = ctx;
  const top = Math.max(0, placed.y);
  const bottom = Math.min(canvas.height, placed.y + placed.height);
  const left = Math.max(0, placed.x);
  const right = Math.min(canvas.width, placed.x + placed.width);
  ctx.beginPath();
  linesOf({ start: placed.x, scale: placed.scale, every: line.every, count: image.width, room: canvas.width }).forEach((x) => {
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
  });
  linesOf({ start: placed.y, scale: placed.scale, every: line.every, count: image.height, room: canvas.height }).forEach((y) => {
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
  });
  ctx.save();
  ctx.globalAlpha = line.opacity;
  ctx.lineWidth = 1;
  ctx.strokeStyle = line.colour;
  ctx.stroke();
  ctx.restore();
};

export { paintGrid };
