/* @layer renderer-app @kind types */
import type { CellFlags, Point, Rect } from '@bxel/document';

type MapMirror = {
  readonly point: (cell: Point) => Point;
  readonly rect: (area: Rect) => Rect;
  readonly flags: (flags: CellFlags) => CellFlags;
};

export type { MapMirror };
