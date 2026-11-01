/* @layer renderer-app @kind types */
import type { RefObject } from 'react';
import type { PixelSource, PixelViewportHandle } from '../PixelViewport';

interface CanvasOverlaysProps {
  source: PixelSource | undefined;
  viewport: RefObject<PixelViewportHandle | null>;
}

interface LoupeProps extends CanvasOverlaysProps {
  host: RefObject<HTMLElement | null>;
}

interface FullscreenPreviewProps {
  source: PixelSource | undefined;
}

export type { CanvasOverlaysProps, FullscreenPreviewProps, LoupeProps };
