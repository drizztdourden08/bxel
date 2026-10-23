/* @layer core @kind types */
import type { PixelBytes } from './png.type';

type RowGeometry = {
  readonly stride: number;
  readonly bpp: number;
  readonly height: number;
};

type RowView = {
  readonly buf: PixelBytes;
  readonly start: number;
  readonly prevStart: number;
  readonly bpp: number;
};

type ScaleGrid = {
  readonly width: number;
  readonly height: number;
  readonly factor: number;
  readonly channels: number;
};

export type { RowGeometry, RowView, ScaleGrid };
