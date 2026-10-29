/* @layer renderer-app @kind constants */
import { DEFAULT_THUMB, ONION_DEFAULTS, PLAY_DEFAULTS } from '../stores/timeline-store.constants';
import type { AnimationSettings } from './animation-settings.type';

const ANIMATION_DEFAULTS: AnimationSettings = {
  animOnionOn: ONION_DEFAULTS.on,
  animOnionBefore: ONION_DEFAULTS.before,
  animOnionAfter: ONION_DEFAULTS.after,
  animOnionOpacity: ONION_DEFAULTS.opacity,
  animOnionFalloff: ONION_DEFAULTS.falloff,
  animOnionTint: ONION_DEFAULTS.tint,
  animOnionBeforeColour: ONION_DEFAULTS.beforeColour,
  animOnionAfterColour: ONION_DEFAULTS.afterColour,
  animOnionStyle: ONION_DEFAULTS.style,
  animOnionOrder: ONION_DEFAULTS.order,
  animOnionWrap: ONION_DEFAULTS.wrap,
  animOnionScope: ONION_DEFAULTS.scope,
  animOnionSkipRepeats: ONION_DEFAULTS.skipRepeats,
  animOnionPosition: ONION_DEFAULTS.position,
  animOnionHideWhilePlaying: ONION_DEFAULTS.hideWhilePlaying,
  animPlayMode: PLAY_DEFAULTS.playMode,
  animSubtags: PLAY_DEFAULTS.subtags,
  animRewind: PLAY_DEFAULTS.rewind,
  animSpeed: PLAY_DEFAULTS.speed,
  animThumb: DEFAULT_THUMB,
};

export { ANIMATION_DEFAULTS };
