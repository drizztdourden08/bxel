/* @layer renderer-app @kind logic */
import { mirroredSource } from './mirrored-source';
import { takeDirty } from './take-dirty';
import type { PixelCanvas, PixelContext, PixelImage } from './upload-image.type';

const uploadImage = (canvas: PixelCanvas, ctx: PixelContext, source: PixelImage): void => {
  const resized = canvas.width !== source.width || canvas.height !== source.height;
  if (resized) {
    canvas.width = source.width;
    canvas.height = source.height;
  }
  const dirty = takeDirty(source.data);
  const mirrored = !resized && mirroredSource.get(canvas) === source;
  if (mirrored && dirty === null) return;
  if (mirrored && dirty) {
    ctx.putImageData(source, 0, 0, dirty.x, dirty.y, dirty.width, dirty.height);
    return;
  }
  ctx.putImageData(source, 0, 0);
  mirroredSource.set(canvas, source);
};

export { uploadImage };
