/* @layer renderer-app @kind logic */
import type { RgbaImage } from '@bxel/formats';

const CHANNELS = 4;

const mirrorRgba = (image: RgbaImage): RgbaImage => {
  const data = new Uint8ClampedArray(image.data.length);
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const from = (y * image.width + x) * CHANNELS;
      const to = (y * image.width + (image.width - 1 - x)) * CHANNELS;
      data.set(image.data.subarray(from, from + CHANNELS), to);
    }
  }
  return { data, width: image.width, height: image.height };
};

export { mirrorRgba };
