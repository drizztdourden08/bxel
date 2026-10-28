/* @layer renderer-app @kind logic */
import { cellWidth } from './cell-width';
import { MIN_TIME_CELL, TIME_CELL_MS } from './track-layout.constants';
import type { TrackLayout } from './track-layout.type';

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

export { trackLayout };
