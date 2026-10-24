/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';
import { cropRgba } from './crop-rgba';
import { opaqueBounds } from './opaque-bounds';
import type { TrimmedImage } from './sheet.type';

const trimRgba = (image: RgbaImage): TrimmedImage => {
  const source = { sourceWidth: image.width, sourceHeight: image.height };
  const bounds = opaqueBounds(image);
  if (!bounds) {
    return { image: { data: new Uint8ClampedArray(4), width: 1, height: 1 }, offsetX: 0, offsetY: 0, ...source };
  }
  return { image: cropRgba(image, bounds), offsetX: bounds.x, offsetY: bounds.y, ...source };
};

export { trimRgba };
