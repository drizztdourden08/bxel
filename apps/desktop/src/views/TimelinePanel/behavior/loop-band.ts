/* @layer renderer-app @kind logic */
import type { AnimFrame } from '@bxel/document';
import type { LoopRange } from '../../../stores/timeline-store.type';
import type { LoopBand, LoopSpan } from './loop-band.type';

const loopBand = (frames: readonly AnimFrame[], loopRange: LoopRange | null, draft: LoopSpan | null): LoopBand => {
  const committed = loopRange ? { from: frames.findIndex((frame) => frame.id === loopRange.from), to: frames.findIndex((frame) => frame.id === loopRange.to) } : null;
  const valid = committed && committed.from >= 0 && committed.to >= 0 ? committed : null;
  const band = draft ?? valid;
  return { valid, band, start: band ? Math.min(band.from, band.to) : 0, end: band ? Math.max(band.from, band.to) : 0 };
};

export { loopBand };
