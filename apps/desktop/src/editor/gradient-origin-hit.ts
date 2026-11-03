/* @layer renderer-app @kind logic */
import { ORIGIN_REACH } from './gradient-origin.constants';

const gradientOriginHit = (origin: { x: number; y: number }, raw: { x: number; y: number }, zoom: number): boolean =>
  Math.hypot(raw.x - origin.x, raw.y - origin.y) * zoom <= ORIGIN_REACH;

export { gradientOriginHit };
