/* @layer core @kind logic */
import type { IndexImage, Sampler } from './resample.type';

const imageSampler = (image: IndexImage, factor: number): Sampler => {
  const { width, height, pixels } = image;
  return (u, v) => {
    const x = Math.floor(u * factor);
    const y = Math.floor(v * factor);
    if (x < 0 || y < 0 || x >= width || y >= height) return -1;
    return pixels[y * width + x] ?? 0;
  };
};

export { imageSampler };
