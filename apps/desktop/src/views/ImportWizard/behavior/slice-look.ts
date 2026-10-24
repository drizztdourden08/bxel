/* @layer renderer-app @kind logic */
import { SLICE_PAINT } from '../ImportWizard.constants';
import type { SliceLook } from '../ImportWizard.type';

const sliceLook = (canvas: HTMLCanvasElement): SliceLook => {
  const style = canvas.ownerDocument.defaultView?.getComputedStyle(canvas);
  const read = (token: string): string => style?.getPropertyValue(token).trim() ?? '';
  return { sunken: read(SLICE_PAINT.tokens.sunken), line: read(SLICE_PAINT.tokens.line), text: read(SLICE_PAINT.tokens.text) };
};

export { sliceLook };
