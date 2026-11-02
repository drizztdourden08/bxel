/* @layer renderer-app @kind logic */
import type { PreviewScale } from '../../../stores/preview-store.type';

const paintPreview = (canvas: HTMLCanvasElement, image: ImageData | null, scale: PreviewScale): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = (image?.width ?? 1) * scale;
  canvas.height = (image?.height ?? 1) * scale;
  if (!image) return;
  const scratch = canvas.ownerDocument.createElement('canvas');
  scratch.width = image.width;
  scratch.height = image.height;
  scratch.getContext('2d')?.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(scratch, 0, 0, canvas.width, canvas.height);
};

export { paintPreview };
