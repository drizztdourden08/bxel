/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';

const scaleBuffer = (source: BufferView, factor: number): BufferView => {
  const scale = Math.max(1, Math.trunc(factor));
  const width = source.width * scale;
  const height = source.height * scale;
  const pixels = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const row = Math.floor(y / scale) * source.width;
    for (let x = 0; x < width; x++) {
      pixels[y * width + x] = source.pixels[row + Math.floor(x / scale)] ?? 0;
    }
  }
  return { pixels, width, height };
};

export { scaleBuffer };
