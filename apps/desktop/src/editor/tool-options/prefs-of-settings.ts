/* @layer renderer-app @kind logic */
import { parsePrefs } from './parse-prefs';
import type { StoredPrefs } from './parse-prefs.type';
import { TOOL_PREF_SETTINGS_DEFAULTS as DEFAULTS } from './tool-pref-settings.constants';
import type { ToolPrefSettings } from './tool-pref-settings.type';

type Picked = Pick<StoredPrefs, 'openOnHover' | 'holdMs' | 'springMs' | 'shareBrush'>;

const prefsOfSettings = (settings: Partial<ToolPrefSettings> & { toolPrefs?: unknown }): Picked => {
  const legacy = parsePrefs(settings.toolPrefs);
  const flat = parsePrefs({ openOnHover: settings.toolOpenOnHover, holdMs: settings.toolHoldMs, springMs: settings.toolSpringMs, shareBrush: settings.toolShareBrush });
  return {
    openOnHover: flat.openOnHover !== DEFAULTS.toolOpenOnHover ? flat.openOnHover : legacy.openOnHover,
    holdMs: flat.holdMs !== DEFAULTS.toolHoldMs ? flat.holdMs : legacy.holdMs,
    springMs: flat.springMs !== DEFAULTS.toolSpringMs ? flat.springMs : legacy.springMs,
    shareBrush: flat.shareBrush !== DEFAULTS.toolShareBrush ? flat.shareBrush : legacy.shareBrush,
  };
};

export { prefsOfSettings };
