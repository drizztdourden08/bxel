/* @layer renderer-app @kind logic */
import type { TimeUnits } from '../stores/timeline-store.type';
import { ticksOf } from './ticks-of';

const formatDuration = (ms: number, units: TimeUnits): string => {
  if (units === 'seconds') return String(Math.round(ms / 10) / 100);
  if (units === 'ticks') return `${ticksOf(ms)}t`;
  return String(ms);
};

export { formatDuration };
