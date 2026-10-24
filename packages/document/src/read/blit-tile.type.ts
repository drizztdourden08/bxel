/* @layer core @kind types */
import type { Point, Size } from '../model/geometry.type';

type BlitTile = {
  readonly target: Uint8Array;
  readonly targetWidth: number;
  readonly source: Uint8Array;
  readonly tile: Size;
  readonly origin: Point;
  readonly cell: number;
};

export type { BlitTile };
