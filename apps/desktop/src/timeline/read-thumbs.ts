/* @layer renderer-app @kind logic */
import { FIT_LIMITS } from '../stores/timeline-store.constants';
import { ANIMATION_DEFAULTS } from './animation-settings.constants';
import type { Stored } from './read-animation-settings.type';
import { readWhole } from './read-whole';

const readThumbs = (stored: Stored): Record<string, number> => {
  const raw = stored.animThumbs;
  if (typeof raw !== 'object' || raw === null) return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([key, value]) => (typeof value === 'number' ? [[key, readWhole(value, FIT_LIMITS.min, FIT_LIMITS.max, ANIMATION_DEFAULTS.animThumb)]] : [])));
};

export { readThumbs };
