/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';

const ghostCanvas = (doc: Document, sprite: Sprite, pixels: Uint8ClampedArray<ArrayBuffer>): HTMLCanvasElement => {
  const canvas = doc.createElement('canvas');
  canvas.width = sprite.width;
  canvas.height = sprite.height;
  canvas.getContext('2d')?.putImageData(new ImageData(pixels, sprite.width, sprite.height), 0, 0);
  return canvas;
};

export { ghostCanvas };
