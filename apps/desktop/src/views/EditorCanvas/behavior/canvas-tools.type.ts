/* @layer renderer-app @kind types */
import type { FocusEventHandler, KeyboardEventHandler, PointerEvent, PointerEventHandler, RefObject } from 'react';
import type { CombineMode, MaskView, Point } from '@bxel/raster';
import type { DragKeys, DragShape, ShapeHold } from '../../../editor/selection/selection.type';
import type { PixelDraw, PixelPoint, PixelViewportHandle } from '../../PixelViewport';

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

type PivotAxis = 'x' | 'y';

interface GripLines {
  x: number;
  y: number;
  allowX: boolean;
  allowY: boolean;
}

interface PivotFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
}

type PivotDrag = AxisDrag;

type ActiveDrag =
  | { kind: 'shape'; shape: DragShape; base: MaskView | null; mode: CombineMode; keys: DragKeys; hold: ShapeHold }
  | { kind: 'outline'; start: Point; base: MaskView }
  | { kind: 'float'; start: Point; origin: Point };

interface MarqueeCorner {
  at: Point;
  from: Point | null;
  variant: string;
}

interface SelectGesture {
  down: (event: PointerEvent<HTMLElement>) => boolean;
  move: (event: PointerEvent<HTMLElement>) => boolean;
  up: () => boolean;
}

interface CanvasTools {
  live: ImageData | null;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
}

interface CanvasReadout {
  draw: PixelDraw;
  onPointerPixel: (pixel: PixelPoint | null) => void;
}

interface KeyContext {
  viewport: RefObject<PixelViewportHandle | null>;
  active: RefObject<boolean>;
  anchor: RefObject<Point | null>;
  points: RefObject<Point[]>;
}

interface CanvasKeys {
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  onPointerPixel: () => void;
  onBlur: FocusEventHandler<HTMLElement>;
}

interface AxisShown {
  x: number | null;
  y: number | null;
}

interface OverlayLook {
  axis: string;
  guide: string;
  cursor: string;
  ink: string;
  ground: string;
}

interface ClientPoint {
  clientX: number;
  clientY: number;
}

export type { ActiveDrag, AxisDrag, AxisShown, CanvasKeys, CanvasReadout, CanvasTools, ClientPoint, GripLines, KeyContext, MarqueeCorner, OverlayLook, PaintGesture, PivotAxis, PivotDrag, PivotFrame, SelectGesture };
