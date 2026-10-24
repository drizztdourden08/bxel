/* @layer renderer-app @kind logic */
import { THUMB_BOX } from '../../../sheet/sheet.constants';
import type { FrameImage } from '../../../sheet/sheet.type';

const drawThumbnail = (canvas: HTMLCanvasElement, image: FrameImage | null): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, THUMB_BOX, THUMB_BOX);
  if (!image) return;
  const source = canvas.ownerDocument.createElement('canvas');
  source.width = image.width;
  source.height = image.height;
  source.getContext('2d')?.putImageData(new ImageData(Uint8ClampedArray.from(image.rgba), image.width, image.height), 0, 0);
  const longest = Math.max(image.width, image.height);
  const fit = THUMB_BOX / longest;
  const scale = fit >= 1 ? Math.floor(fit) : fit;
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, Math.floor((THUMB_BOX - width) / 2), Math.floor((THUMB_BOX - height) / 2), width, height);
};

export { drawThumbnail };
