/* @layer core @kind logic */
import { checkImageShape } from './check-image-shape';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import { PNG_LIMITS } from './png-limits.constants';
import type { IndexedImage, PngFailure } from './png.type';

const checkIndexedImage = (image: IndexedImage): PngFailure | undefined => {
  const shape = checkImageShape(image.width, image.height, image.indices.length, 1);
  if (shape) return shape;
  const entries = image.palette.length / 4;
  if (!Number.isInteger(entries) || entries < 1 || entries > PNG_LIMITS.PALETTE_MAX_ENTRIES) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_INPUT, 'Palette must hold 1 to 256 RGBA entries');
  }
  const count = image.indices.length;
  for (let at = 0; at < count; at += 1) {
    const index = image.indices[at] ?? 0;
    if (index >= entries) {
      return pngFail(PNG_ERROR_CODE.PNG_INVALID_INPUT, `Index ${index} is outside the palette`);
    }
  }
  return undefined;
};

export { checkIndexedImage };
