/* @layer renderer-app @kind logic */
import { MAX_DURATION_MS } from '@bxel/document';
import type { TimeUnits } from '../stores/timeline-store.type';
import { SNAP_MS, TICK_FPS } from './track-layout.constants';

const snapDuration = (ms: number, units: TimeUnits, free: boolean): number => {
  const clamped = Math.min(Math.max(ms, 1), MAX_DURATION_MS);
  if (free) return Math.round(clamped);
  if (units === 'ticks') return Math.round((Math.max(1, Math.round((clamped * TICK_FPS) / 1000)) * 1000) / TICK_FPS);
  return Math.max(SNAP_MS, Math.round(clamped / SNAP_MS) * SNAP_MS);
};

export { snapDuration };
