/* @layer renderer-app @kind types */
import type { MouseEventHandler, PointerEventHandler } from 'react';
import type { PixelDraw, PixelPoint } from '../../PixelViewport';

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

export type { CanvasReadout, CanvasTools };
