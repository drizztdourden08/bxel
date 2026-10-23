/* @layer core @kind logic */
import { clampFactor } from './clamp-factor';
import type { RgbaImage } from './png.type';
import { scaleInto } from './scale-into';

const upscaleRgba = (image: RgbaImage, factor: number): RgbaImage => {
  const scale = clampFactor(factor);
  const data = new Uint8ClampedArray(image.width * scale * image.height * scale * 4);
  const { width, height } = image;
  scaleInto(image.data, data, { width, height, factor: scale, channels: 4 });
  return { data, width: image.width * scale, height: image.height * scale };
};

export { upscaleRgba };
