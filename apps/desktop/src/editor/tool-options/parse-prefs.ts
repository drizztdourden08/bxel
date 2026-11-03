/* @layer renderer-app @kind logic */
import { HOLD_RANGE, SPRING_RANGE, TOOL_PREFS_DEFAULTS } from '../../stores/tool-prefs-store.constants';
import { SLOT_GROUPS } from '../tool-catalogue/tool-catalogue.constants';
import { isRecord } from './is-record';
import type { SurfaceLayouts } from '../../stores/tool-prefs-store.type';
import type { SlotGroupId } from '../tool-catalogue/tool-catalogue.type';
import { ALL_SURFACES } from '../tool-catalogue/surfaces.constants';
import type { StoredPrefs } from './parse-prefs.type';

const holdOf = (raw: unknown): number =>
  typeof raw === 'number' ? Math.min(HOLD_RANGE.max, Math.max(HOLD_RANGE.min, Math.round(raw))) : TOOL_PREFS_DEFAULTS.holdMs;

const springOf = (raw: unknown): number =>
  typeof raw === 'number' ? Math.min(SPRING_RANGE.max, Math.max(SPRING_RANGE.min, Math.round(raw))) : TOOL_PREFS_DEFAULTS.springMs;

const tiersOf = (raw: unknown): Record<string, 1 | 2> =>
  isRecord(raw) ? Object.fromEntries(Object.entries(raw).flatMap(([id, tier]) => (tier === 1 || tier === 2 ? [[id, tier] as const] : []))) : {};

const memberIdsOf = (raw: unknown): { members?: string[] } => {
  const ids = Array.isArray(raw) ? raw.filter((each): each is string => typeof each === 'string') : [];
  return ids.length === 0 ? {} : { members: ids };
};

const placeOf = (raw: unknown): { id: string; group: SlotGroupId; members?: string[] }[] => {
  if (!isRecord(raw) || typeof raw.id !== 'string') return [];
  const group = SLOT_GROUPS.find((each) => each.id === raw.group);
  return group === undefined ? [] : [{ id: raw.id, group: group.id, ...memberIdsOf(raw.members) }];
};

const listOf = (raw: unknown): unknown[] => (Array.isArray(raw) ? raw : []);

const layoutsOf = (raw: unknown): SurfaceLayouts => {
  if (!isRecord(raw)) return {};
  const entries = ALL_SURFACES.filter((surface) => Array.isArray(raw[surface])).map((surface) => [surface, listOf(raw[surface]).flatMap(placeOf)] as const);
  return Object.fromEntries(entries);
};

const parsePrefs = (raw: unknown): StoredPrefs => {
  const source = isRecord(raw) ? raw : {};
  return {
    openOnHover: source.openOnHover === true,
    holdMs: holdOf(source.holdMs),
    springMs: springOf(source.springMs),
    optionTiers: tiersOf(source.optionTiers),
    hiddenMembers: Array.isArray(source.hiddenMembers) ? source.hiddenMembers.filter((each): each is string => typeof each === 'string') : [],
    layouts: layoutsOf(source.layouts),
    shareBrush: source.shareBrush === true,
  };
};

export { parsePrefs };
