/* @layer renderer-app @kind logic */
import type { ToolPrefSettings } from './tool-pref-settings.type';
import type { StoredPrefs } from './parse-prefs.type';

const settingsOfPrefs = (prefs: Pick<StoredPrefs, 'openOnHover' | 'holdMs' | 'springMs' | 'shareBrush'>): ToolPrefSettings => ({
  toolOpenOnHover: prefs.openOnHover,
  toolHoldMs: prefs.holdMs,
  toolSpringMs: prefs.springMs,
  toolShareBrush: prefs.shareBrush,
});

export { settingsOfPrefs };
