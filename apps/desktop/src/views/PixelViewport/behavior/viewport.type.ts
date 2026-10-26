/* @layer renderer-app @kind types */
import type { FocusEventHandler, KeyboardEventHandler, MouseEventHandler, PointerEvent, PointerEventHandler, RefObject } from 'react';
import type { CanvasLook, GridFlags } from '../../../canvas-look/canvas-look.type';
import type { PixelDraw, PixelPoint, PixelSource, PixelTiling, PixelView } from '../PixelViewport.type';

interface ImageSize {
  width: number;
  height: number;
}

interface ViewBox {
  width: number;
  height: number;
  dpr: number;
  margin: number;
  step: number;
}

interface ViewTarget {
  zoom: number;
  pan: PixelPoint;
}

interface ViewStateParams {
  image: ImageSize;
  box: ViewBox;
  levels: readonly number[];
  zoom?: number;
  pan?: PixelPoint;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (pan: PixelPoint) => void;
}

interface ViewState {
  target: ViewTarget;
  latest: RefObject<ViewTarget>;
  apply: (next: ViewTarget) => void;
  zoomTo: (zoom: number, anchor?: PixelPoint) => void;
  zoomStep: (direction: number, anchor?: PixelPoint) => void;
  panBy: (dx: number, dy: number) => void;
  fit: () => void;
}

interface FrameInput {
  target: ViewTarget;
  box: ViewBox;
  image: ImageSize;
  draw?: PixelDraw;
  guides?: PixelDraw;
  source?: PixelSource;
  gridFrom: number;
  grids: GridFlags;
  look: CanvasLook;
  tiled: PixelTiling;
}

interface PlacedImage {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

interface PaintTools {
  ctx: CanvasRenderingContext2D;
  placed: PlacedImage;
  view: PixelView;
  scratch: () => HTMLCanvasElement;
  primary: boolean;
}

interface FrameCache {
  tile: HTMLCanvasElement | null;
  tileKey: string;
  scratch: HTMLCanvasElement | null;
}

interface WheelSteps {
  steps: number;
  carried: number;
}

interface WheelLike {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  shiftKey: boolean;
}

interface KeyLike {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

interface GridAxis {
  start: number;
  scale: number;
  every: number;
  count: number;
  room: number;
}

interface PanDrag {
  pointer: number;
  x: number;
  y: number;
  pan: PixelPoint;
}

interface ViewportKeys {
  spaceHeld: RefObject<boolean>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  onKeyUp: KeyboardEventHandler<HTMLElement>;
  onBlur: FocusEventHandler<HTMLElement>;
}

interface PanDragging {
  start: (event: PointerEvent<HTMLElement>) => boolean;
  move: (event: PointerEvent<HTMLElement>) => boolean;
  end: (event: PointerEvent<HTMLElement>) => boolean;
}

interface PointerPixel {
  report: (event: PointerEvent<HTMLElement>) => void;
  clear: () => void;
}

interface ViewportHandlers {
  onMouseDown: MouseEventHandler<HTMLElement>;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onPointerCancel: PointerEventHandler<HTMLElement>;
  onPointerLeave: PointerEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  onKeyUp: KeyboardEventHandler<HTMLElement>;
  onBlur: FocusEventHandler<HTMLElement>;
}

interface ViewportParts {
  rootRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  view: ViewState;
  box: ViewBox;
  image: ImageSize;
}

interface ViewportModel {
  rootRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  handlers: ViewportHandlers;
  announcement: string;
}

export type {
  FrameCache, FrameInput, GridAxis, ImageSize, KeyLike, PaintTools, PanDrag, PanDragging, PlacedImage, PointerPixel, ViewBox,
  ViewportHandlers, ViewportKeys, ViewportModel, ViewportParts, ViewState, ViewStateParams, ViewTarget, WheelLike, WheelSteps,
};
