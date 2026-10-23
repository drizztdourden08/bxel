/* @layer core @kind logic */
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import type { PngFailure } from './png.type';

const checkImageShape = (
  width: number,
  height: number,
  length: number,
  channels: number,
): PngFailure | undefined => {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_INPUT, 'Width and height must be integers >= 1');
  }
  if (length !== width * height * channels) {
    return pngFail(
      PNG_ERROR_CODE.PNG_INVALID_INPUT,
      `Pixel buffer holds ${length} values, expected ${width * height * channels}`,
    );
  }
  return undefined;
};

export { checkImageShape };
