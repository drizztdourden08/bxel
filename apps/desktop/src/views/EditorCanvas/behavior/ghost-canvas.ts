/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';

const ghostCanvas = (doc: Document, size: Size, pixels: Uint8ClampedArray<ArrayBuffer>): HTMLCanvasElement => {
  const canvas = doc.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  canvas.getContext('2d')?.putImageData(new ImageData(pixels, size.width, size.height), 0, 0);
  return canvas;
};

export { ghostCanvas };
