/* @layer renderer-app @kind logic */
import { OVERLAY_TOKENS } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const tokenOf = (style: CSSStyleDeclaration | undefined, name: string): string => style?.getPropertyValue(name).trim() ?? '';

const overlayLook = (canvas: HTMLCanvasElement): OverlayLook => {
  const style = canvas.ownerDocument.defaultView?.getComputedStyle(canvas);
  return {
    axis: tokenOf(style, OVERLAY_TOKENS.axis),
    guide: tokenOf(style, OVERLAY_TOKENS.guide),
    cursor: tokenOf(style, OVERLAY_TOKENS.cursor),
    ink: tokenOf(style, OVERLAY_TOKENS.ink),
    ground: tokenOf(style, OVERLAY_TOKENS.ground),
  };
};

export { overlayLook };
