/* @layer core @kind logic */
import { grayAlphaWriter } from './gray-alpha-writer';
import { grayWriter } from './gray-writer';
import { indexedWriter } from './indexed-writer';
import { PNG_COLOR_TYPE } from './png-color-type.constants';
import type { ExpandContext, PixelWriter } from './png-decode.type';
import { rgbaWriter } from './rgba-writer';
import { rgbWriter } from './rgb-writer';
import { rowStride } from './row-stride';

const WRITERS: Readonly<Record<number, (context: ExpandContext) => PixelWriter>> = {
  [PNG_COLOR_TYPE.GRAY]: grayWriter,
  [PNG_COLOR_TYPE.RGB]: rgbWriter,
  [PNG_COLOR_TYPE.INDEXED]: indexedWriter,
  [PNG_COLOR_TYPE.GRAY_ALPHA]: grayAlphaWriter,
  [PNG_COLOR_TYPE.RGBA]: rgbaWriter,
};

const expandPixels = (context: ExpandContext): Uint8ClampedArray | undefined => {
  const { width, height, colorType, bitsPerPixel } = context.header;
  const write = WRITERS[colorType]?.(context);
  if (!write) return undefined;
  const stride = rowStride(width, bitsPerPixel);
  const out = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!write(y * stride, x, out, (y * width + x) * 4)) return undefined;
    }
  }
  return out;
};

export { expandPixels };
