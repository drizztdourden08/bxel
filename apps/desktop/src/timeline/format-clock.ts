/* @layer renderer-app @kind logic */
import type { TimeUnits } from '../stores/timeline-store.type';
import { ticksOf } from './ticks-of';

const formatClock = (at: number, total: number, units: TimeUnits): string => {
  if (units === 'seconds') return `${(at / 1000).toFixed(2)} / ${(total / 1000).toFixed(2)} s`;
  if (units === 'ticks') return `${ticksOf(at)} / ${ticksOf(total)} ticks`;
  return `${at} / ${total} ms`;
};

export { formatClock };
