/* @layer core @kind logic */
import type { PixelBytes } from './png.type';
import type { ScaleGrid } from './scanline.type';

const scaleInto = (source: PixelBytes, target: PixelBytes, grid: ScaleGrid): void => {
  const { width, height, factor, channels } = grid;
  const outWidth = width * factor;
  for (let y = 0; y < height * factor; y += 1) {
    const sourceRow = Math.floor(y / factor) * width;
    for (let x = 0; x < outWidth; x += 1) {
      const from = (sourceRow + Math.floor(x / factor)) * channels;
      target.set(source.subarray(from, from + channels), (y * outWidth + x) * channels);
    }
  }
};

export { scaleInto };
