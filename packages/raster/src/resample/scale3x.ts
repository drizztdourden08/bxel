/* @layer core @kind logic */
import { readPixel } from './read-pixel';
import type { IndexImage, StepConfig } from './resample.type';
import { THREE } from './scale3x.constants';
import { threeByThree } from './three-by-three';

const scale3x = (image: IndexImage, config: StepConfig): IndexImage => {
  const { width, height } = image;
  const wide = width * THREE;
  const out = new Uint8Array(wide * height * THREE);
  const at = (x: number, y: number): number => readPixel(image, x, y, config.border);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cells = threeByThree({
        a: at(x - 1, y - 1), b: at(x, y - 1), c: at(x + 1, y - 1),
        d: at(x - 1, y), e: at(x, y), f: at(x + 1, y),
        g: at(x - 1, y + 1), h: at(x, y + 1), i: at(x + 1, y + 1),
        same: config.same,
      });
      cells.forEach((value, cell) => {
        out[(y * THREE + Math.floor(cell / THREE)) * wide + x * THREE + (cell % THREE)] = value;
      });
    }
  }
  return { width: wide, height: height * THREE, pixels: out };
};

export { scale3x };
