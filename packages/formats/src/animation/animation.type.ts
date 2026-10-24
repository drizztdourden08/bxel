/* @layer core @kind types */
import type { PixelBytes } from '../png.type';
import type { FormatFailure } from '../failure/format.type';

type DecodedFrame = {
  readonly data: Uint8ClampedArray;
  readonly delayMs: number;
};

type AnimationDecoded = {
  readonly ok: true;
  readonly width: number;
  readonly height: number;
  readonly loops: number;
  readonly frames: readonly DecodedFrame[];
};

type AnimationDecodeResult = AnimationDecoded | FormatFailure;

type IndexedFrame = {
  readonly indices: Uint8Array;
  readonly delayMs: number;
};

type GifAnimation = {
  readonly width: number;
  readonly height: number;
  readonly palette: PixelBytes;
  readonly transparentIndex: number | null;
  readonly loops: number;
  readonly frames: readonly IndexedFrame[];
};

type ApngFrame = {
  readonly pixels: PixelBytes;
  readonly delayMs: number;
};

type ApngAnimation = {
  readonly width: number;
  readonly height: number;
  readonly palette: PixelBytes | undefined;
  readonly loops: number;
  readonly frames: readonly ApngFrame[];
};

export type {
  AnimationDecoded,
  AnimationDecodeResult,
  ApngAnimation,
  ApngFrame,
  DecodedFrame,
  GifAnimation,
  IndexedFrame,
};
