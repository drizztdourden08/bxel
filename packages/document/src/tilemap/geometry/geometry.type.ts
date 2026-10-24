/* @layer core @kind types */
import type { Point, Size } from '../../model/geometry.type';
import type { MapOrientation } from '../../model/tilemap.type';

type MapGeometry = {
  readonly width: number;
  readonly height: number;
  readonly originOf: (column: number, row: number) => Point;
  readonly outline: (column: number, row: number) => readonly Point[];
  readonly cellAt: (x: number, y: number) => Point;
  readonly cellNear: (x: number, y: number) => Point;
};

type GeometryRequest = {
  readonly columns: number;
  readonly rows: number;
  readonly tile: Size;
  readonly orientation?: MapOrientation | undefined;
};

type GridShape = {
  readonly grid: Size;
  readonly tile: Size;
};

export type { GeometryRequest, GridShape, MapGeometry };
