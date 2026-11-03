/* @layer renderer-app @kind logic */
import type { RulerMarker } from '@drizztdourden08/tessera';
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';
import type { OnionSettings } from '../../../stores/timeline-store.type';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const onionMarkers = (onion: OnionSettings, current: number, last: number): readonly RulerMarker[] => {
  if (!onion.on || current < 0) return [];
  const { min, max } = ONION_LIMITS.frames;
  return [
    {
      id: 'before',
      index: Math.max(0, current - onion.before),
      min: Math.max(0, current - max),
      max: Math.max(0, current - min),
      label: TIMELINE_PANEL_TEXT.onionBefore(onion.before),
      tone: 'rose',
    },
    {
      id: 'after',
      index: Math.min(last, current + onion.after),
      min: Math.min(last, current + min),
      max: Math.min(last, current + max),
      label: TIMELINE_PANEL_TEXT.onionAfter(onion.after),
      tone: 'blue',
    },
  ];
};

export { onionMarkers };
