/* @layer tests @kind helper */
import type { RgbaImage } from '@bxel/formats';

const makeGradient = (width: number, height: number): RgbaImage => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      for (let c = 0; c < 4; c += 1) {
        data[(y * width + x) * 4 + c] = (x * 37 + y * 91 + c * 53 + x * y * 7) & 255;
      }
    }
  }
  return { data, width, height };
};

export { makeGradient };
