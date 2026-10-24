/* @layer renderer-app @kind logic */
import type { SliceRect, SourceImage } from '../../../image-import/image-import.type';
import { paintCell } from './paint-cell';
import { sliceLook } from './slice-look';
import { sliceScale } from './slice-scale';

const paintSlices = (canvas: HTMLCanvasElement, image: SourceImage, rects: readonly SliceRect[]): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const scale = sliceScale(image);
  const look = sliceLook(canvas);
  const layer = new OffscreenCanvas(image.width, image.height);
  layer.getContext('2d')?.putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = look.sunken;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(layer, 0, 0, image.width * scale, image.height * scale);
  for (const rect of rects) paintCell(ctx, rect, scale, look);
};

export { paintSlices };
