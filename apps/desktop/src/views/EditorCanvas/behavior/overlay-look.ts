/* @layer renderer-app @kind logic */
import { OVERLAY_TOKENS } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const overlayLook = (canvas: HTMLCanvasElement): OverlayLook => {
  const style = canvas.ownerDocument.defaultView?.getComputedStyle(canvas);
  return {
    axis: style?.getPropertyValue(OVERLAY_TOKENS.axis).trim() ?? '',
    cursor: style?.getPropertyValue(OVERLAY_TOKENS.cursor).trim() ?? '',
  };
};

export { overlayLook };
