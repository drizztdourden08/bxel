/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { shownRect } from './shown-rect';

const shownPercent = (view: PixelView): number => {
  const area = Math.max(1, view.imageWidth * view.imageHeight);
  const shown = shownRect(view);
  return Math.min(100, Math.round(((shown.width * shown.height) / area) * 100));
};

export { shownPercent };
