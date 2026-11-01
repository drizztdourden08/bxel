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

const isoShift = (slide: number, rise: number): number => ((slide % rise) + rise) % rise;

const paintIsoGrid = (ctx: CanvasRenderingContext2D, placed: PlacedImage, image: ImageSize, line: GridLine): void => {
  const cell = Math.max(2, line.every);
  const rise = cell / 2;
  const across = (line.offsetX ?? 0) / 2;
  const down = line.offsetY ?? 0;
  const base = isoOffsets(image, rise);
  const falling = base.map((offset) => offset + isoShift(down - across, rise));
  const rising = base.map((offset) => offset + isoShift(down + across, rise));
  const scale = placed.scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(placed.x, placed.y, placed.width, placed.height);
  ctx.clip();
  ctx.beginPath();
  falling.forEach((offset) => {
    ctx.moveTo(placed.x, placed.y + offset * scale);
    ctx.lineTo(placed.x + image.width * scale, placed.y + (offset + image.width / 2) * scale);
  });
  rising.forEach((offset) => {
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
