/* @layer renderer-app @kind types */
import type { MouseEventHandler, PointerEvent, PointerEventHandler } from 'react';
import type { PixelDraw, PixelPoint } from '../../PixelViewport';

interface PaintGesture {
  live: ImageData | null;
  down: (event: PointerEvent<HTMLElement>) => void;
  move: (event: PointerEvent<HTMLElement>) => void;
  up: () => void;
}

interface AxisDrag {
  down: (event: PointerEvent<HTMLElement>) => boolean;
  move: (event: PointerEvent<HTMLElement>) => boolean;
  up: () => boolean;
}

interface CanvasTools {
  live: ImageData | null;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onContextMenu: MouseEventHandler<HTMLElement>;
}

interface CanvasReadout {
  draw: PixelDraw;
  onPointerPixel: (pixel: PixelPoint | null) => void;
}

interface OverlayLook {
  axis: string;
  cursor: string;
}

interface ClientPoint {
  clientX: number;
  clientY: number;
}

export type { AxisDrag, CanvasReadout, CanvasTools, ClientPoint, OverlayLook, PaintGesture };
