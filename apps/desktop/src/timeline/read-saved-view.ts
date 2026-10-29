/* @layer renderer-app @kind logic */
import { FIT_LIMITS } from '../stores/timeline-store.constants';
import { readFlag } from './read-flag';
import { readOneOf } from './read-one-of';
import { readWhole } from './read-whole';
import { EMPTY_VIEW, UNIT_CHOICES } from './saved-view.constants';
import type { SavedView } from './saved-view.type';

const readZooms = (raw: unknown): Record<string, number> => {
  if (typeof raw !== 'object' || raw === null) return {};
  const fallback = FIT_LIMITS.max;
  return Object.fromEntries(Object.entries(raw).flatMap(([key, value]) => (typeof value === 'number' ? [[key, readWhole(value, FIT_LIMITS.min, FIT_LIMITS.max, fallback)]] : [])));
};

const readSavedView = (raw: unknown): SavedView => {
  const stored = typeof raw === 'object' && raw !== null ? (raw as Partial<Record<keyof SavedView, unknown>>) : {};
  return {
    zooms: readZooms(stored.zooms),
    timeMode: readFlag(stored.timeMode, EMPTY_VIEW.timeMode),
    units: readOneOf(stored.units, UNIT_CHOICES, EMPTY_VIEW.units),
  };
};

export { readSavedView };
