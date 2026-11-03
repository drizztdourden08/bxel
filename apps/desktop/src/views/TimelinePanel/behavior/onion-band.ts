/* @layer renderer-app @kind logic */
import type { RulerBand } from '@drizztdourden08/tessera';
import type { OnionSettings } from '../../../stores/timeline-store.type';

const onionBand = (onion: OnionSettings, current: number, last: number): RulerBand | null => {
  if (!onion.on || current < 0) return null;
  return { from: Math.max(0, current - onion.before), to: Math.min(last, current + onion.after) };
};

export { onionBand };
