/* @layer renderer-app @kind logic */
import { HOLD_RANGE, TOOL_PREFS_DEFAULTS } from '../../stores/tool-prefs-store.constants';
import { isRecord } from './is-record';
import type { StoredPrefs } from './parse-prefs.type';

const holdOf = (raw: unknown): number =>
  typeof raw === 'number' ? Math.min(HOLD_RANGE.max, Math.max(HOLD_RANGE.min, Math.round(raw))) : TOOL_PREFS_DEFAULTS.holdMs;

const parsePrefs = (raw: unknown): StoredPrefs => {
  const source = isRecord(raw) ? raw : {};
  return {
    openOnHover: source.openOnHover === true,
    holdMs: holdOf(source.holdMs),
    showKeys: source.showKeys === true,
    hiddenMembers: Array.isArray(source.hiddenMembers) ? source.hiddenMembers.filter((each): each is string => typeof each === 'string') : [],
    shareBrush: source.shareBrush === true,
  };
};

export { parsePrefs };
