/* @layer renderer-app @kind logic */
import { WHEEL } from '../PixelViewport.constants';
import type { PixelPoint } from '../PixelViewport.type';
import type { WheelLike } from './viewport.type';

const unitOf = (mode: number, page: number): number => {
  if (mode === WHEEL.lineMode) return WHEEL.linePixels;
  return mode === WHEEL.pageMode ? page : 1;
};

const wheelDelta = (event: WheelLike, page: number): PixelPoint => {
  const unit = unitOf(event.deltaMode, page);
  const x = event.deltaX * unit;
  const y = event.deltaY * unit;
  return event.shiftKey && x === 0 ? { x: y, y: 0 } : { x, y };
};

export { wheelDelta };
