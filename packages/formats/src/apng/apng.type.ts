/* @layer core @kind types */
import type { Box } from '../pixels/box.type';
import type { DecodedFrame } from '../animation/animation.type';

type ApngControl = {
  readonly sequence: number;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;
  readonly delayMs: number;
  readonly dispose: number;
  readonly blend: number;
};

type ApngFrameData = {
  readonly control: ApngControl;
  readonly data: Uint8Array[];
};

type ApngDraft = {
  ihdr: Uint8Array | undefined;
  plte: Uint8Array | undefined;
  trns: Uint8Array | undefined;
  plays: number | undefined;
  declared: number;
  readonly frames: ApngFrameData[];
  sawIdat: boolean;
  nextSequence: number;
  owner: ApngFrameData | undefined;
};

type ApngLayout = {
  readonly ihdr: Uint8Array;
  readonly plte: Uint8Array | undefined;
  readonly trns: Uint8Array | undefined;
  readonly plays: number;
  readonly width: number;
  readonly height: number;
  readonly frames: readonly ApngFrameData[];
};

type ApngPixels = {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;
};

type ApngPending = {
  readonly dispose: number;
  readonly region: Box;
  readonly backup: Uint8ClampedArray | undefined;
};

type ApngRenderState = {
  readonly canvas: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  readonly frames: DecodedFrame[];
  pending: ApngPending | undefined;
};

export type {
  ApngControl,
  ApngDraft,
  ApngFrameData,
  ApngLayout,
  ApngPixels,
  ApngRenderState,
};
