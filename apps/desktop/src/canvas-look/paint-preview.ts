/* @layer renderer-app @kind logic */
import type { CanvasLook, GridFlags, PreviewKind } from './canvas-look.type';
import { paintCanvasPreview } from './paint-canvas-preview';
import { paintGridPreview } from './paint-grid-preview';
import { paintSurroundPreview } from './paint-surround-preview';

const paintPreview = (canvas: HTMLCanvasElement, kind: PreviewKind, look: CanvasLook, flags: GridFlags): void => {
  if (kind === 'grid') paintGridPreview(canvas, look, flags);
  else if (kind === 'surround') paintSurroundPreview(canvas, look);
  else paintCanvasPreview(canvas, look);
};

export { paintPreview };
