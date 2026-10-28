/* @layer renderer-app @kind logic */
import type { TimelineSettings } from '../stores/timeline-store.type';
import type { Persisted } from './write-animation-settings.type';

const writeAnimationSettings = (state: Pick<TimelineSettings, 'onion' | 'playMode' | 'subtags' | 'rewind' | 'speed' | 'timeMode' | 'units'>): Persisted => {
  const { onion } = state;
  return {
    animOnionOn: onion.on,
    animOnionBefore: onion.before,
    animOnionAfter: onion.after,
    animOnionOpacity: onion.opacity,
    animOnionFalloff: onion.falloff,
    animOnionTint: onion.tint,
    animOnionBeforeColour: onion.beforeColour,
    animOnionAfterColour: onion.afterColour,
    animOnionStyle: onion.style,
    animOnionOrder: onion.order,
    animOnionWrap: onion.wrap,
    animOnionScope: onion.scope,
    animOnionSkipRepeats: onion.skipRepeats,
    animOnionPosition: onion.position,
    animOnionHideWhilePlaying: onion.hideWhilePlaying,
    animPlayMode: state.playMode,
    animSubtags: state.subtags,
    animRewind: state.rewind,
    animSpeed: state.speed,
    animTimeMode: state.timeMode,
    animUnits: state.units,
  };
};

export { writeAnimationSettings };
