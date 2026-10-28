/* @layer renderer-app @kind logic */
import { FIT_LIMITS } from '../stores/timeline-store.constants';
import type { ViewSettings } from '../stores/timeline-store.type';
import { ANIMATION_DEFAULTS } from './animation-settings.constants';
import type { Stored } from './read-animation-settings.type';
import { readFlag } from './read-flag';
import { readOneOf } from './read-one-of';
import { readWhole } from './read-whole';

const readView = (stored: Stored): ViewSettings => ({
  zoom: readWhole(stored.animThumb, FIT_LIMITS.min, FIT_LIMITS.max, ANIMATION_DEFAULTS.animThumb),
  timeMode: readFlag(stored.animTimeMode, ANIMATION_DEFAULTS.animTimeMode),
  units: readOneOf(stored.animUnits, ['ms', 'seconds', 'ticks'], ANIMATION_DEFAULTS.animUnits),
});

export { readView };
