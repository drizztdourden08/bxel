/* @layer renderer-app @kind constants */
import type { CanvasPreviewKind } from './CanvasPreview.type';

const PREVIEW_LABEL: Readonly<Record<CanvasPreviewKind, string>> = {
  background: 'Preview of the checkerboard inside the canvas surround',
  grid: 'Preview of the pixel, major and tile grids over the checkerboard',
};

export { PREVIEW_LABEL };
