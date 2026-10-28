/* @layer core @kind logic */
import { readPixel } from './read-pixel';
import type { IndexImage, StepConfig } from './resample.type';
import { rounds } from './rounds-corner';

const scale2x = (image: IndexImage, config: StepConfig): IndexImage => {
  const { width, height } = image;
  const out = new Uint8Array(width * height * 4);
  const { same, border } = config;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const b = readPixel(image, x, y - 1, border);
      const d = readPixel(image, x - 1, y, border);
      const e = readPixel(image, x, y, border);
      const f = readPixel(image, x + 1, y, border);
      const h = readPixel(image, x, y + 1, border);
      const at = y * 2 * width * 2 + x * 2;
      out[at] = rounds(same, [d, b, h, f]) ? b : e;
      out[at + 1] = rounds(same, [b, f, d, h]) ? f : e;
      out[at + width * 2] = rounds(same, [h, d, f, b]) ? d : e;
      out[at + width * 2 + 1] = rounds(same, [f, h, b, d]) ? h : e;
    }
  }
  return { width: width * 2, height: height * 2, pixels: out };
};

export { scale2x };
