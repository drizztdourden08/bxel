/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { NAVIGATOR_TEXT } from '../Navigator.constants';
import { shownRect } from './shown-rect';

const describeView = (view: PixelView): string => {
  const shown = shownRect(view);
  return NAVIGATOR_TEXT.describe({
    left: Math.floor(shown.x),
    top: Math.floor(shown.y),
    right: Math.min(view.imageWidth, Math.ceil(shown.x + shown.width)),
    bottom: Math.min(view.imageHeight, Math.ceil(shown.y + shown.height)),
    width: view.imageWidth,
    height: view.imageHeight,
    percent: Math.round(view.zoom * 100),
  });
};

export { describeView };
