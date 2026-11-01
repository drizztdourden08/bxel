/* @layer renderer-app @kind logic */
import { HOLD_RANGE, SPRING_RANGE, TOOL_PREFS_DEFAULTS } from '../../stores/tool-prefs-store.constants';
import { isRecord } from './is-record';
import type { StoredPrefs } from './parse-prefs.type';

const holdOf = (raw: unknown): number =>
  typeof raw === 'number' ? Math.min(HOLD_RANGE.max, Math.max(HOLD_RANGE.min, Math.round(raw))) : TOOL_PREFS_DEFAULTS.holdMs;

const springOf = (raw: unknown): number =>
  typeof raw === 'number' ? Math.min(SPRING_RANGE.max, Math.max(SPRING_RANGE.min, Math.round(raw))) : TOOL_PREFS_DEFAULTS.springMs;

const parsePrefs = (raw: unknown): StoredPrefs => {
  const source = isRecord(raw) ? raw : {};
  return {
    openOnHover: source.openOnHover === true,
    holdMs: holdOf(source.holdMs),
    springMs: springOf(source.springMs),
    hiddenMembers: Array.isArray(source.hiddenMembers) ? source.hiddenMembers.filter((each): each is string => typeof each === 'string') : [],
    shareBrush: source.shareBrush === true,
  };
};

export { parsePrefs };
