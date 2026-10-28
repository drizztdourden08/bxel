/* @layer renderer-app @kind constants */
import type { ToolPrefs } from './tool-prefs-store.type';

const TOOL_PREFS_DEFAULTS: ToolPrefs = { openOnHover: false, holdMs: 350, showKeys: false, hiddenMembers: [] };

const HOLD_RANGE = { min: 120, max: 800, step: 10 } as const;

export { HOLD_RANGE, TOOL_PREFS_DEFAULTS };
