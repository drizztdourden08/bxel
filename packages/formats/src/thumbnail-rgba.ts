/* @layer core @kind logic */
import type { RgbaImage } from './png.type';
import { thumbnailFactor } from './thumbnail-factor';
import { upscaleRgba } from './upscale-rgba';

const thumbnailRgba = (image: RgbaImage, maxSide?: number): RgbaImage =>
  upscaleRgba(image, thumbnailFactor(image.width, image.height, maxSide));

export { thumbnailRgba };
