/* @layer renderer-app @kind logic */
import { SHEET_TOKENS } from '../SheetCanvas.constants';
import type { SheetLook } from '../SheetCanvas.type';

const sheetLook = (canvas: HTMLCanvasElement): SheetLook => {
  const style = canvas.ownerDocument.defaultView?.getComputedStyle(canvas);
  const read = (token: string): string => style?.getPropertyValue(token).trim() ?? '';
  return {
    frame: read(SHEET_TOKENS.frame),
    selected: read(SHEET_TOKENS.selected),
    active: read(SHEET_TOKENS.active),
    overlap: read(SHEET_TOKENS.overlap),
    slice: read(SHEET_TOKENS.slice),
    pivot: read(SHEET_TOKENS.pivot),
    label: read(SHEET_TOKENS.label),
  };
};

export { sheetLook };
