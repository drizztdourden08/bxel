/* @layer core @kind logic */
import { CLEANEDGE_HALF } from './cleanedge.constants';
import { readPixel } from './read-pixel';
import type { IndexImage, Sampler } from './resample.type';

const sideOf = (fraction: number): number => (fraction < CLEANEDGE_HALF ? -1 : 1);

const reachOf = (fraction: number, side: number): number => (side < 0 ? fraction : 1 - fraction);

const cleanedgeSampler = (image: IndexImage): Sampler => {
  const read = (x: number, y: number): number => readPixel(image, x, y, 'transparent');
  const outside = (u: number, v: number): boolean => u < 0 || v < 0 || u >= image.width || v >= image.height;
  return (u, v) => {
    if (outside(u, v)) return -1;
    const [x, y] = [Math.floor(u), Math.floor(v)];
    const [sx, sy] = [sideOf(u - x), sideOf(v - y)];
    const centre = read(x, y);
    const horizontal = read(x + sx, y);
    const vertical = read(x, y + sy);
    const reach = reachOf(u - x, sx) + reachOf(v - y, sy);
    const agree = horizontal === vertical && horizontal !== centre;
    return agree && read(x + sx, y + sy) !== horizontal && reach < CLEANEDGE_HALF ? horizontal : centre;
  };
};

export { cleanedgeSampler };
