/* @layer renderer-app @kind logic */
import type { ShapeSnap } from '../../stores/tileset-view-store.type';
import { snapStep } from './snap-step';

const snapTo = (value: number, snap: ShapeSnap, limit: number): number => {
  const step = snapStep(snap);
  return Math.min(limit, Math.max(0, Math.round(value / step) * step));
};

export { snapTo };
