/* @layer renderer-app @kind logic */
import type { PixelSource } from '../../PixelViewport';
import { drawableOf } from '../../PixelViewport/behavior/drawable-of';
import type { ThumbSize } from '../Navigator.type';

const paintThumb = (canvas: HTMLCanvasElement, source: PixelSource, thumb: ThumbSize, scratch: () => HTMLCanvasElement): void => {
  const dpr = canvas.ownerDocument.defaultView?.devicePixelRatio ?? 1;
  const width = Math.round(thumb.width * dpr);
  const height = Math.round(thumb.height * dpr);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext('2d');
  const drawable = drawableOf(source, scratch);
  if (!ctx || !drawable) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = thumb.scale < 1;
  ctx.imageSmoothingQuality = 'medium';
  ctx.drawImage(drawable, 0, 0, width, height);
};

export { paintThumb };
