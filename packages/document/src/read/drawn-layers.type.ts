/* @layer core @kind types */
import type { Layer } from '../model/sprite.type';

type DrawnLayer = { readonly layer: Layer; readonly pixels: Uint8Array };

type RgbaPicture = { readonly width: number; readonly height: number; readonly data: Uint8Array | Uint8ClampedArray };

type FrameView = {
  readonly alpha?: (layer: Layer) => number;
  readonly reference?: (layer: Layer) => RgbaPicture | null;
};

export type { DrawnLayer, FrameView, RgbaPicture };
