/* @layer renderer-app @kind constants */
import { TOOL_PREFS_DEFAULTS } from '../../stores/tool-prefs-store.constants';
import type { ToolPrefSettings } from './tool-pref-settings.type';

const TOOL_PREF_SETTINGS_DEFAULTS: ToolPrefSettings = {
  toolOpenOnHover: TOOL_PREFS_DEFAULTS.openOnHover,
  toolHoldMs: TOOL_PREFS_DEFAULTS.holdMs,
  toolSpringMs: TOOL_PREFS_DEFAULTS.springMs,
  toolShareBrush: false,
};

export { TOOL_PREF_SETTINGS_DEFAULTS };
