/* @layer renderer-app @kind logic */
import { SPEEDS } from '../stores/timeline-store.constants';
import type { PlaySettings } from '../stores/timeline-store.type';
import { ANIMATION_DEFAULTS } from './animation-settings.constants';
import type { Stored } from './read-animation-settings.type';
import { readFlag } from './read-flag';
import { readOneOf } from './read-one-of';

const readPlay = (stored: Stored): PlaySettings => {
  const speed = typeof stored.animSpeed === 'number' && SPEEDS.includes(stored.animSpeed) ? stored.animSpeed : ANIMATION_DEFAULTS.animSpeed;
  return {
    playMode: readOneOf(stored.animPlayMode, ['loop', 'once', 'pingpong'], ANIMATION_DEFAULTS.animPlayMode),
    subtags: readFlag(stored.animSubtags, ANIMATION_DEFAULTS.animSubtags),
    rewind: readFlag(stored.animRewind, ANIMATION_DEFAULTS.animRewind),
    speed,
  };
};

export { readPlay };
