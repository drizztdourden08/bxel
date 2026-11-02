/* @layer renderer-app @kind logic */
import type { RgbaImage } from '@bxel/formats';
import { CHANNELS } from './crop-rgba.constants';
import type { ArtRect } from './render-overlay.type';

const cropRgba = (image: RgbaImage, rect: ArtRect, scale: number): RgbaImage => {
  const left = Math.max(0, rect.x * scale);
  const top = Math.max(0, rect.y * scale);
  const width = Math.min(image.width - left, rect.width * scale);
  const height = Math.min(image.height - top, rect.height * scale);
  const data = new Uint8ClampedArray(width * height * CHANNELS);
  for (let row = 0; row < height; row += 1) {
    const from = ((top + row) * image.width + left) * CHANNELS;
    data.set(image.data.subarray(from, from + width * CHANNELS), row * width * CHANNELS);
  }
  return { data, width, height };
};

export { cropRgba };
