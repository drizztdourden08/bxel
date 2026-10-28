/* @layer renderer-app @kind logic */
import type { ImageRect } from '../Navigator.type';

const place = (element: HTMLElement | null, rect: ImageRect | null, scale: number): void => {
  if (!element) return;
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    element.hidden = true;
    return;
  }
  element.hidden = false;
  element.style.insetInlineStart = `${rect.x * scale}px`;
  element.style.insetBlockStart = `${rect.y * scale}px`;
  element.style.inlineSize = `${rect.width * scale}px`;
  element.style.blockSize = `${rect.height * scale}px`;
};

export { place };
