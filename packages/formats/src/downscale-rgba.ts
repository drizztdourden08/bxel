/* @layer core @kind logic */
import type { RgbaImage } from './png.type';

const downscaleRgba = (image: RgbaImage, step: number): RgbaImage => {
  const every = Number.isFinite(step) ? Math.max(1, Math.trunc(step)) : 1;
  const width = Math.ceil(image.width / every);
  const height = Math.ceil(image.height / every);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const from = (y * every * image.width + x * every) * 4;
      data.set(image.data.subarray(from, from + 4), (y * width + x) * 4);
    }
  }
  return { data, width, height };
};

export { downscaleRgba };
