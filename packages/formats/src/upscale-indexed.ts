/* @layer core @kind logic */
import { clampFactor } from './clamp-factor';
import type { IndexedImage } from './png.type';
import { scaleInto } from './scale-into';

const upscaleIndexed = (image: IndexedImage, factor: number): IndexedImage => {
  const scale = clampFactor(factor);
  const indices = new Uint8Array(image.width * scale * image.height * scale);
  const { width, height } = image;
  scaleInto(image.indices, indices, { width, height, factor: scale, channels: 1 });
  return { ...image, indices, width: image.width * scale, height: image.height * scale };
};

export { upscaleIndexed };
