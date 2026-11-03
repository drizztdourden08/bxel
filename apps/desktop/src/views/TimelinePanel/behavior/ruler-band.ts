/* @layer renderer-app @kind logic */
import type { AnimFrame } from '@bxel/document';
import type { RulerBand } from '@drizztdourden08/tessera';
import type { LoopRange } from '../../../stores/timeline-store.type';

const rulerBand = (frames: readonly AnimFrame[], loopRange: LoopRange | null): RulerBand | null => {
  if (!loopRange) return null;
  const from = frames.findIndex((frame) => frame.id === loopRange.from);
  const to = frames.findIndex((frame) => frame.id === loopRange.to);
  return from < 0 || to < 0 ? null : { from: Math.min(from, to), to: Math.max(from, to) };
};

export { rulerBand };
