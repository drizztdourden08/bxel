/* @layer renderer-app @kind logic */
import { FIT_LIMITS } from '../stores/timeline-store.constants';
import { CELL_PAD, MIN_CELL, MIN_TIME_CELL, TIME_CELL_MS } from './track-layout.constants';
import type { TrackLayout } from './track-layout.type';

const cellWidth = (thumb: number): number => Math.max(thumb + CELL_PAD * 2, MIN_CELL);

const trackLayout = (durations: readonly number[], thumb: number, timeMode: boolean): TrackLayout => {
  const unit = cellWidth(thumb);
  const widths = durations.map((ms) => (timeMode ? Math.max(MIN_TIME_CELL, Math.round((ms * unit) / TIME_CELL_MS)) : unit));
  const lefts: number[] = [];
  let total = 0;
  for (const width of widths) {
    lefts.push(total);
    total += width;
  }
  return { lefts, widths, total, pxPerMs: unit / TIME_CELL_MS };
};

const fitThumb = (durations: readonly number[], available: number, timeMode: boolean): number => {
  for (let thumb = FIT_LIMITS.max; thumb > FIT_LIMITS.min; thumb -= 1) {
    if (trackLayout(durations, thumb, timeMode).total <= available) return thumb;
  }
  return FIT_LIMITS.min;
};

export { cellWidth, fitThumb, trackLayout };
