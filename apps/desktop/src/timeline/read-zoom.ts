/* @layer renderer-app @kind logic */
import { FIT_LIMITS } from '../stores/timeline-store.constants';
import { ANIMATION_DEFAULTS } from './animation-settings.constants';
import type { Stored } from './read-animation-settings.type';
import { readWhole } from './read-whole';

const readZoom = (stored: Stored): number => readWhole(stored.animThumb, FIT_LIMITS.min, FIT_LIMITS.max, ANIMATION_DEFAULTS.animThumb);

export { readZoom };
