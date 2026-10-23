/* @layer core @kind constants */
import { grayAlphaWriter } from './gray-alpha-writer';
import { grayWriter } from './gray-writer';
import { indexedWriter } from './indexed-writer';
import { PNG_COLOR_TYPE } from './png-color-type.constants';
import type { ExpandContext, PixelWriter } from './png-decode.type';
import { rgbaWriter } from './rgba-writer';
import { rgbWriter } from './rgb-writer';

const PIXEL_WRITERS: Readonly<Record<number, (context: ExpandContext) => PixelWriter>> = {
  [PNG_COLOR_TYPE.GRAY]: grayWriter,
  [PNG_COLOR_TYPE.RGB]: rgbWriter,
  [PNG_COLOR_TYPE.INDEXED]: indexedWriter,
  [PNG_COLOR_TYPE.GRAY_ALPHA]: grayAlphaWriter,
  [PNG_COLOR_TYPE.RGBA]: rgbaWriter,
};

export { PIXEL_WRITERS };
