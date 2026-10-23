/* @layer renderer-app @kind logic */
import { PIXEL_FALLBACK, PIXEL_TOKENS } from '../PixelViewport.constants';
import type { ViewBox } from './viewport.type';
import { readLength } from './read-length';
import { windowOf } from './window-of';

const measureBox = (root: HTMLElement): ViewBox => {
  const view = windowOf(root);
  const style = view.getComputedStyle(root);
  return {
    width: root.clientWidth,
    height: root.clientHeight,
    dpr: view.devicePixelRatio || 1,
    margin: readLength(style, PIXEL_TOKENS.margin, PIXEL_FALLBACK.margin),
    step: readLength(style, PIXEL_TOKENS.step, PIXEL_FALLBACK.step),
  };
};

export { measureBox };
