/* @layer renderer-app @kind logic */
import type { PixelSource } from '../PixelViewport.type';

const isImageData = (source: PixelSource): source is ImageData => 'data' in source && 'colorSpace' in source;

const drawableOf = (source: PixelSource, scratch: () => HTMLCanvasElement): CanvasImageSource | null => {
  if (!isImageData(source)) return source;
  const canvas = scratch();
  if (canvas.width !== source.width) canvas.width = source.width;
  if (canvas.height !== source.height) canvas.height = source.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.putImageData(source, 0, 0);
  return canvas;
};

export { drawableOf };
