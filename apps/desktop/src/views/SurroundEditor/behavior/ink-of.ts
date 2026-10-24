/* @layer renderer-app @kind logic */
import { EDITOR_INK_FALLBACK, EDITOR_INK_TOKEN } from '../SurroundEditor.constants';

const inkOf = (canvas: HTMLCanvasElement): string => {
  const read = canvas.ownerDocument.defaultView?.getComputedStyle(canvas).getPropertyValue(EDITOR_INK_TOKEN).trim() ?? '';
  return read === '' ? EDITOR_INK_FALLBACK : read;
};

export { inkOf };
