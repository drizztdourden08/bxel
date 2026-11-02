/* @layer renderer-app @kind logic */
import type { RgbaPicture } from '@bxel/document';

const made = new WeakMap<RgbaPicture, HTMLCanvasElement>();

const pictureCanvas = (picture: RgbaPicture): HTMLCanvasElement | null => {
  const known = made.get(picture);
  if (known) return known;
  const canvas = document.createElement('canvas');
  canvas.width = picture.width;
  canvas.height = picture.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.putImageData(new ImageData(new Uint8ClampedArray(picture.data), picture.width, picture.height), 0, 0);
  made.set(picture, canvas);
  return canvas;
};

export { pictureCanvas };
