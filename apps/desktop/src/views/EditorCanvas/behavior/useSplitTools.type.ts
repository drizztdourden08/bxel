/* @layer renderer-app @kind types */
import type { PointerEvent, RefObject } from 'react';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { CanvasTools } from './canvas-tools.type';

type ViewportRef = RefObject<PixelViewportHandle | null>;

interface ViewHandlers {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
}

interface SplitTools {
  live: CanvasTools['live'];
  forView: (view: ViewportRef) => ViewHandlers;
}

export type { SplitTools, ViewHandlers, ViewportRef };
