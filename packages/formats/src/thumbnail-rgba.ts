/* @layer core @kind logic */
import { downscaleRgba } from './downscale-rgba';
import type { RgbaImage } from './png.type';
import { thumbnailFactor } from './thumbnail-factor';
import { thumbnailStep } from './thumbnail-step';
import { upscaleRgba } from './upscale-rgba';

const thumbnailRgba = (image: RgbaImage, maxSide?: number): RgbaImage => {
  const step = thumbnailStep(image.width, image.height, maxSide);
  if (step > 1) return downscaleRgba(image, step);
  return upscaleRgba(image, thumbnailFactor(image.width, image.height, maxSide));
};

export { thumbnailRgba };
