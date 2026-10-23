/* @layer core @kind types */
import type { PNG_ERROR_CODE } from './png-error.constants';
import type { PNG_FILTER } from './png-filter.constants';

type PixelBytes = Uint8Array | Uint8ClampedArray;

type RgbaImage = {
  readonly data: PixelBytes;
  readonly width: number;
  readonly height: number;
};

type IndexedImage = {
  readonly indices: Uint8Array;
  readonly palette: PixelBytes;
  readonly width: number;
  readonly height: number;
};

type PngErrorCode = (typeof PNG_ERROR_CODE)[keyof typeof PNG_ERROR_CODE];

type PngFilterType = (typeof PNG_FILTER)[keyof typeof PNG_FILTER];

type PngEncodeOptions = {
  readonly filter?: PngFilterType | 'adaptive';
};

type PngFailure = {
  readonly ok: false;
  readonly code: PngErrorCode;
  readonly message: string;
};

type PngEncodeResult = { readonly ok: true; readonly bytes: Uint8Array } | PngFailure;

type PngDecodeResult =
  | {
      readonly ok: true;
      readonly width: number;
      readonly height: number;
      readonly data: Uint8ClampedArray;
    }
  | PngFailure;

export type {
  IndexedImage,
  PixelBytes,
  PngDecodeResult,
  PngEncodeOptions,
  PngEncodeResult,
  PngErrorCode,
  PngFailure,
  PngFilterType,
  RgbaImage,
};
