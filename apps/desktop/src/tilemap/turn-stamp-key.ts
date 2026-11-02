/* @layer renderer-app @kind logic */
import { inMapPlace } from './in-map-place';
import { transformStamp } from './transform-stamp';
import type { StampTransform } from './tilemap.type';

const turnStampKey = (op: StampTransform): boolean => {
  if (!inMapPlace()) return false;
  transformStamp(op);
  return true;
};

export { turnStampKey };
