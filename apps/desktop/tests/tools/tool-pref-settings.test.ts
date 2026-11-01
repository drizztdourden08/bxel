/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { prefsOfSettings } from '../../src/editor/tool-options/prefs-of-settings';
import { settingsOfPrefs } from '../../src/editor/tool-options/settings-of-prefs';
import { TOOL_PREF_SETTINGS_DEFAULTS } from '../../src/editor/tool-options/tool-pref-settings.constants';
import { HOLD_RANGE } from '../../src/stores/tool-prefs-store.constants';

describe('K1 tool preferences in the settings page', { tags: ['critical'] }, () => {
  it('read the settings page keys when they differ from the defaults', () => {
    const prefs = prefsOfSettings({ ...TOOL_PREF_SETTINGS_DEFAULTS, toolHoldMs: 500, toolOpenOnHover: true, toolShareBrush: true });
    expect(prefs).toMatchObject({ holdMs: 500, openOnHover: true, shareBrush: true, springMs: TOOL_PREF_SETTINGS_DEFAULTS.toolSpringMs });
  });

  it('keep the value an older version stored in the preferences object', () => {
    const prefs = prefsOfSettings({ ...TOOL_PREF_SETTINGS_DEFAULTS, toolPrefs: { holdMs: 640, springMs: 300, openOnHover: true } });
    expect(prefs).toMatchObject({ holdMs: 640, springMs: 300, openOnHover: true });
  });

  it('let the settings page win over an older stored value', () => {
    const prefs = prefsOfSettings({ ...TOOL_PREF_SETTINGS_DEFAULTS, toolHoldMs: 200, toolPrefs: { holdMs: 640 } });
    expect(prefs.holdMs).toBe(200);
  });

  it('clamp a value that is out of range', () => {
    expect(prefsOfSettings({ ...TOOL_PREF_SETTINGS_DEFAULTS, toolHoldMs: 99999 }).holdMs).toBe(HOLD_RANGE.max);
  });

  it('round trip through the flat keys', () => {
    const prefs = { openOnHover: true, holdMs: 410, springMs: 260, shareBrush: true };
    expect(prefsOfSettings(settingsOfPrefs(prefs))).toEqual(prefs);
  });
});
