/* @layer renderer-app @kind logic */
import type { TimeUnits } from '../stores/timeline-store.type';
import { TICK_FPS } from './track-layout.constants';

const ticksOf = (ms: number): number => Math.round((ms * TICK_FPS) / 1000);

const formatDuration = (ms: number, units: TimeUnits): string => {
  if (units === 'seconds') return String(Math.round(ms / 10) / 100);
  if (units === 'ticks') return `${ticksOf(ms)}t`;
  return String(ms);
};

const formatClock = (at: number, total: number, units: TimeUnits): string => {
  if (units === 'seconds') return `${(at / 1000).toFixed(2)} / ${(total / 1000).toFixed(2)} s`;
  if (units === 'ticks') return `${ticksOf(at)} / ${ticksOf(total)} ticks`;
  return `${at} / ${total} ms`;
};

export { formatClock, formatDuration, ticksOf };
