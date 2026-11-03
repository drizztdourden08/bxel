/* @layer renderer-app @kind logic */
import type { AnimFrame } from '@bxel/document';
import type { RulerBand } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';

const setRulerBand = (frames: readonly AnimFrame[], band: RulerBand | null): void => {
  const { setLoopRange } = useTimelineStore.getState();
  if (band === null) {
    setLoopRange(null);
    return;
  }
  const from = frames[band.from];
  const to = frames[band.to];
  if (from && to && from.id !== to.id) setLoopRange({ from: from.id, to: to.id });
};

export { setRulerBand };
