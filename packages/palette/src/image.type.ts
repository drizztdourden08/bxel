/* @layer core @kind types */
type RgbaImage = {
  readonly data: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
};

type IndexBuffer = {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
};

export type { IndexBuffer, RgbaImage };
