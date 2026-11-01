/* @layer renderer-app @kind constants */
import type { ToolPrefs } from './tool-prefs-store.type';

const TOOL_PREFS_DEFAULTS: ToolPrefs = { openOnHover: false, holdMs: 350, springMs: 220, hiddenMembers: [], optionTiers: {} };

const HOLD_RANGE = { min: 120, max: 800, step: 10 } as const;

const SPRING_RANGE = { min: 120, max: 600, step: 10 } as const;

export { SPRING_RANGE, HOLD_RANGE, TOOL_PREFS_DEFAULTS };
