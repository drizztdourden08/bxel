/* @layer renderer-app @kind logic */
import { uploadImage } from '../../../canvas-dirty/upload-image';
import type { PixelSource } from '../PixelViewport.type';

const isImageData = (source: PixelSource): source is ImageData => 'data' in source && 'colorSpace' in source;

const drawableOf = (source: PixelSource, scratch: () => HTMLCanvasElement): CanvasImageSource | null => {
  if (!isImageData(source)) return source;
  const canvas = scratch();
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  uploadImage(canvas, ctx, source);
  return canvas;
};

export { drawableOf };
