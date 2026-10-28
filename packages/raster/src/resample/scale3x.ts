/* @layer core @kind logic */
import { readPixel } from './read-pixel';
import type { IndexImage, StepConfig } from './resample.type';

const THREE = 3;

/** Scale3x from the Scale2x family. Only values found in the input reach the output. */
const scale3x = (image: IndexImage, config: StepConfig): IndexImage => {
  const { width, height } = image;
  const wide = width * THREE;
  const out = new Uint8Array(wide * height * THREE);
  const { border } = config;
  const eq = config.same;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = readPixel(image, x - 1, y - 1, border);
      const b = readPixel(image, x, y - 1, border);
      const c = readPixel(image, x + 1, y - 1, border);
      const d = readPixel(image, x - 1, y, border);
      const e = readPixel(image, x, y, border);
      const f = readPixel(image, x + 1, y, border);
      const g = readPixel(image, x - 1, y + 1, border);
      const h = readPixel(image, x, y + 1, border);
      const i = readPixel(image, x + 1, y + 1, border);
      const db = eq(d, b) && !eq(b, f) && !eq(d, h);
      const bf = eq(b, f) && !eq(b, d) && !eq(f, h);
      const dh = eq(d, h) && !eq(d, b) && !eq(h, f);
      const hf = eq(h, f) && !eq(d, h) && !eq(b, f);
      const at = y * THREE * wide + x * THREE;
      out[at] = db ? d : e;
      out[at + 1] = (db && !eq(e, c)) || (bf && !eq(e, a)) ? b : e;
      out[at + 2] = bf ? f : e;
      out[at + wide] = (db && !eq(e, g)) || (dh && !eq(e, a)) ? d : e;
      out[at + wide + 1] = e;
      out[at + wide + 2] = (bf && !eq(e, i)) || (hf && !eq(e, c)) ? f : e;
      out[at + 2 * wide] = dh ? d : e;
      out[at + 2 * wide + 1] = (dh && !eq(e, i)) || (hf && !eq(e, g)) ? h : e;
      out[at + 2 * wide + 2] = hf ? f : e;
    }
  }
  return { width: wide, height: height * THREE, pixels: out };
};

export { scale3x };
