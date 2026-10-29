/* @layer renderer-app @kind logic */
import type { AnimFrame } from '@bxel/document';
import type { TimeUnits } from '../../../stores/timeline-store.type';
import { formatDuration } from '../../../timeline/format-duration';

const tickLabel = (frames: readonly AnimFrame[], index: number, timeMode: boolean, units: TimeUnits): string => {
  if (!timeMode) return String(index + 1);
  const before = frames.slice(0, index).reduce((total, frame) => total + frame.durationMs, 0);
  return formatDuration(before, units);
};

export { tickLabel };
