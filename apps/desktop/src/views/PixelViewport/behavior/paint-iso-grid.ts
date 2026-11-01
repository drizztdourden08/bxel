/* @layer renderer-app @kind logic */
import type { GridLine } from '../../../canvas-look/canvas-look.type';
import type { ImageSize, PlacedImage } from './viewport.type';

const isoOffsets = (image: ImageSize, rise: number): number[] => {
  const low = Math.floor(-image.width / 2 / rise) - 1;
  const high = Math.ceil((image.height + image.width / 2) / rise) + 1;
  const offsets: number[] = [];
  for (let at = low; at <= high; at += 1) offsets.push(at * rise);
  return offsets;
};

const paintIsoGrid = (ctx: CanvasRenderingContext2D, placed: PlacedImage, image: ImageSize, line: GridLine): void => {
  const cell = Math.max(2, line.every);
  const offsets = isoOffsets(image, cell / 2);
  const scale = placed.scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(placed.x, placed.y, placed.width, placed.height);
  ctx.clip();
  ctx.beginPath();
  offsets.forEach((offset) => {
    ctx.moveTo(placed.x, placed.y + offset * scale);
    ctx.lineTo(placed.x + image.width * scale, placed.y + (offset + image.width / 2) * scale);
    ctx.moveTo(placed.x, placed.y + offset * scale);
    ctx.lineTo(placed.x + image.width * scale, placed.y + (offset - image.width / 2) * scale);
  });
  ctx.globalAlpha = line.opacity;
  ctx.lineWidth = 1;
  ctx.strokeStyle = line.colour;
  ctx.stroke();
  ctx.restore();
};

export { paintIsoGrid };
