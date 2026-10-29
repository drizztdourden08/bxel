/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import type { PlacedMap } from './placed-map.type';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';

const placedMap = (): PlacedMap | null => {
  const target = readiedMap();
  const stamp = target ? readyStamp(target) : null;
  return target && stamp ? { target, stamp, flags: useTilemapStore.getState().flags } : null;
};

export { placedMap };
