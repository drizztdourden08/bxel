/* @layer renderer-app @kind logic */
import { RECT_ZOOM_FILL } from '../PixelViewport.constants';
import type { PixelRect } from '../PixelViewport.type';
import type { ViewBox, ViewTarget } from './viewport.type';

const wholeBelowFit = (raw: number): number => {
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  return raw >= 1 ? Math.floor(raw) : raw;
};

const rectTarget = (rect: PixelRect, box: ViewBox): ViewTarget => {
  const raw = Math.min((box.width * RECT_ZOOM_FILL) / Math.max(1, rect.width), (box.height * RECT_ZOOM_FILL) / Math.max(1, rect.height));
  return { zoom: wholeBelowFit(raw), pan: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } };
};

export { rectTarget };
