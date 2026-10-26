/* @layer renderer-app @kind constants */
import type { PreviewKind } from '../../canvas-look/canvas-look.type';

const PREVIEW_LABEL: Readonly<Record<PreviewKind, string>> = {
  canvas: 'Preview of the checkerboard behind transparent pixels',
  surround: 'Preview of the surround pattern behind the canvas',
  grid: 'Preview of the pixel, major and tile grids over the checkerboard',
};

export { PREVIEW_LABEL };
