/* @layer core @kind logic */
import { readPixel } from './read-pixel';
import type { IndexImage, Sampler } from './resample.type';

const HALF = 0.5;

/**
 * Edge preserving sampler in the spirit of cleanEdge: a pixel is split into four quadrants.
 * When the two neighbours that touch a quadrant agree and the diagonal one differs, the corner is
 * cut along the diagonal, so a one pixel line stays a line. Only colours of the input appear.
 */
const cleanedgeSampler = (image: IndexImage): Sampler => {
  const read = (x: number, y: number): number => readPixel(image, x, y, 'transparent');
  return (u, v) => {
    if (u < 0 || v < 0 || u >= image.width || v >= image.height) return -1;
    const x = Math.floor(u);
    const y = Math.floor(v);
    const fx = u - x;
    const fy = v - y;
    const sx = fx < HALF ? -1 : 1;
    const sy = fy < HALF ? -1 : 1;
    const centre = read(x, y);
    const horizontal = read(x + sx, y);
    const vertical = read(x, y + sy);
    const reach = (sx < 0 ? fx : 1 - fx) + (sy < 0 ? fy : 1 - fy);
    const cut = horizontal === vertical && horizontal !== centre && read(x + sx, y + sy) !== horizontal && reach < HALF;
    return cut ? horizontal : centre;
  };
};

export { cleanedgeSampler };
