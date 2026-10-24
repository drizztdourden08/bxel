/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import type { CanvasLook } from './canvas-look.type';

const spriteLook = (look: CanvasLook, grid: Size | undefined): CanvasLook =>
  grid === undefined ? look : { ...look, pixelLine: { ...look.pixelLine, every: grid.width, everyY: grid.height } };

export { spriteLook };
