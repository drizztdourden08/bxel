/* @layer renderer-app @kind types */
import type { PointerEvent } from 'react';
import type { CellFlags, Point } from '@bxel/document';
import type { CanvasLook } from '../../canvas-look/canvas-look.type';
import type { MapSelection, TileStamp } from '../../stores/tilemap-store.type';
import type { MapTarget, MapTool } from '../../tilemap/tilemap.type';
import type { PixelPoint } from '../PixelViewport';

type MapDrag =
  | { kind: 'stroke'; tool: 'place' | 'erase'; cells: Point[] }
  | { kind: 'rect'; from: Point; to: Point }
  | { kind: 'select'; from: Point; to: Point };

interface MapLive {
  hover: Point | null;
  drag: MapDrag | null;
}

interface MapPaintBase {
  target: MapTarget;
  tool: MapTool;
  stamp: TileStamp;
  flags: CellFlags;
  selection: MapSelection | null;
  filled: boolean;
  cells: boolean;
  look: CanvasLook;
}

interface MapPaintState extends MapPaintBase {
  live: MapLive;
}

interface MapLook {
  cursor: string;
  erase: string;
  select: string;
}

interface BoxStyle {
  colour: string;
  dashed: boolean;
}

interface MapGesture {
  down: (event: PointerEvent<HTMLElement>) => void;
  move: (event: PointerEvent<HTMLElement>) => void;
  up: () => void;
  hover: (pixel: PixelPoint | null) => void;
  cancel: () => void;
}

interface MapView {
  target: MapTarget;
  image: ImageData;
}

interface TilemapSurfaceProps {
  view: MapView;
}

export type { BoxStyle, MapDrag, MapGesture, MapLive, MapLook, MapPaintBase, MapPaintState, MapView, TilemapSurfaceProps };
