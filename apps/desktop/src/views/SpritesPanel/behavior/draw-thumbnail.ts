/* @layer renderer-app @kind logic */
import type { FrameImage } from '../../../sheet/sheet.type';
import { frameCanvas } from './frame-canvas';

const drawThumbnail = (canvas: HTMLCanvasElement, image: FrameImage | null, box: number): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, box, box);
  if (!image) return;
  const longest = Math.max(image.width, image.height);
  const fit = box / longest;
  const scale = fit >= 1 ? Math.floor(fit) : fit;
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameCanvas(canvas.ownerDocument, image), Math.floor((box - width) / 2), Math.floor((box - height) / 2), width, height);
};

export { drawThumbnail };
