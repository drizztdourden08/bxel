/* @layer renderer-app @kind types */
import type { KeyboardEventHandler, PointerEventHandler, Ref } from 'react';

interface PixelPoint {
  x: number;
  y: number;
}

interface PixelView {
  zoom: number;
  pan: PixelPoint;
  originX: number;
  originY: number;
  width: number;
  height: number;
  dpr: number;
  imageWidth: number;
  imageHeight: number;
}

type PixelDraw = (ctx: CanvasRenderingContext2D, view: PixelView) => void;

type PixelSource = ImageData | ImageBitmap | HTMLCanvasElement | HTMLImageElement | OffscreenCanvas;

type PixelWheel = 'zoom' | 'pan';

interface PixelViewportHandle {
  screenToPixel: (clientX: number, clientY: number) => PixelPoint;
  pixelToScreen: (x: number, y: number) => PixelPoint;
  fit: () => void;
  setZoom: (zoom: number, anchor?: PixelPoint) => void;
  zoomIn: (anchor?: PixelPoint) => void;
  zoomOut: (anchor?: PixelPoint) => void;
  redraw: () => void;
  view: () => PixelView;
}

interface PixelViewportProps {
  width: number;
  height: number;
  label: string;
  draw?: PixelDraw;
  source?: PixelSource;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  pan?: PixelPoint;
  onPanChange?: (pan: PixelPoint) => void;
  zoomSteps?: readonly number[];
  grid?: boolean;
  gridFrom?: number;
  wheel?: PixelWheel;
  onPointerPixel?: (pixel: PixelPoint | null) => void;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  onPointerMove?: PointerEventHandler<HTMLElement>;
  onPointerUp?: PointerEventHandler<HTMLElement>;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  className?: string;
  ref?: Ref<PixelViewportHandle>;
}

export type { PixelDraw, PixelPoint, PixelSource, PixelView, PixelViewportHandle, PixelViewportProps, PixelWheel };
