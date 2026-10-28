/* @layer core @kind logic */
import { readPixel } from './read-pixel';
import type { IndexImage, StepConfig } from './resample.type';

/** EPX, also called Scale2x. Only values found in the input reach the output. */
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
      out[at] = same(d, b) && !same(h, b) && !same(f, b) ? b : e;
      out[at + 1] = same(b, f) && !same(d, f) && !same(h, f) ? f : e;
      out[at + width * 2] = same(h, d) && !same(f, d) && !same(b, d) ? d : e;
      out[at + width * 2 + 1] = same(f, h) && !same(b, h) && !same(d, h) ? h : e;
    }
  }
  return { width: width * 2, height: height * 2, pixels: out };
};

export { scale2x };
