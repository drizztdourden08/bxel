/* @layer core @kind logic */
import { cachedNearest } from './cached-nearest';
import { ditherOffset } from './dither-offset';
import type { IndexBuffer } from './image.type';
import { packRgb } from './pack-rgb';
import type { MapImageOptions } from './palette-map.type';
import { shiftColor } from './shift-color';

const mapImage = ({ image, table, alphaThreshold, dither }: MapImageOptions): IndexBuffer => {
  const { data, width, height } = image;
  const pixels = new Uint8Array(width * height);
  const cache = new Map<number, number>();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const at = (y * width + x) * 4;
      if ((data[at + 3] ?? 0) < alphaThreshold) continue;
      const base = packRgb(data[at] ?? 0, data[at + 1] ?? 0, data[at + 2] ?? 0);
      const rgb = dither ? shiftColor(base, ditherOffset(dither, x, y)) : base;
      pixels[y * width + x] = cachedNearest(cache, rgb, table);
    }
  }
  return { pixels, width, height };
};

export { mapImage };
