/* @layer core @kind types */
import type { PixelBytes, PngFilterType } from './png.type';

type RowGeometry = {
  readonly stride: number;
  readonly bpp: number;
  readonly height: number;
};

type FilterLanes = {
  readonly cur: PixelBytes;
  readonly up: PixelBytes;
  readonly out: Uint8Array;
  readonly bpp: number;
};

type UnfilterLanes = {
  readonly raw: PixelBytes;
  readonly up: PixelBytes;
  readonly out: Uint8Array;
  readonly bpp: number;
};

type ScaleGrid = {
  readonly width: number;
  readonly height: number;
  readonly factor: number;
  readonly channels: number;
};

type FilteredRow = { readonly type: PngFilterType; readonly bytes: Uint8Array };

export type { FilteredRow, FilterLanes, RowGeometry, ScaleGrid, UnfilterLanes };
