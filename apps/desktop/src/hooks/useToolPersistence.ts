/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { applyOptionSnapshot } from '../editor/tool-options/apply-option-snapshot';
import { optionSnapshot } from '../editor/tool-options/option-snapshot';
import { parsePrefs } from '../editor/tool-options/parse-prefs';
import { parseOptionValues } from '../editor/tool-options/parse-option-values';
import { parsePresets } from '../editor/tool-options/parse-presets';
import { prefsOfSettings } from '../editor/tool-options/prefs-of-settings';
import { settingsOfPrefs } from '../editor/tool-options/settings-of-prefs';
import type { AppSettings } from '../settings.type';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useToolPrefsStore } from '../stores/useToolPrefsStore';
import { useToolPresetStore } from '../stores/useToolPresetStore';
import { useToolStore } from '../stores/useToolStore';
import { isRecord } from '../editor/tool-options/is-record';
import { LEGACY_KEYS, SAVE_DELAY_MS } from './use-tool-persistence.constants';

const collect = () => {
  const { openOnHover, holdMs, springMs, hiddenMembers, optionTiers, layouts } = useToolPrefsStore.getState();
  const shareBrush = useToolStore.getState().shareBrush;
  return {
    toolOptions: optionSnapshot(),
    toolPresets: useToolPresetStore.getState().user,
    toolPrefs: { hiddenMembers, optionTiers, layouts },
    ...settingsOfPrefs({ openOnHover, holdMs, springMs, shareBrush }),
  };
};

const useToolPersistence = (): void => {
  const { settings, patch, hydrated } = useSettings<AppSettings>();
  const loaded = useRef(false);
  const saved = useRef('');
  const first = useRef(settings);
  useEffect(() => {
    first.current = settings;
  }, [settings]);
  useEffect(() => {
    if (!hydrated || loaded.current) return;
    const prefs = parsePrefs(first.current.toolPrefs);
    const flat = prefsOfSettings(first.current);
    useToolPrefsStore.getState().patch({ openOnHover: flat.openOnHover, holdMs: flat.holdMs, springMs: flat.springMs, hiddenMembers: prefs.hiddenMembers, optionTiers: prefs.optionTiers, layouts: prefs.layouts });
    useToolStore.getState().setShareBrush(flat.shareBrush);
    useToolPresetStore.getState().load(parsePresets(first.current.toolPresets));
    applyOptionSnapshot(parseOptionValues(first.current.toolOptions));
    saved.current = JSON.stringify(collect());
    loaded.current = true;
    if (LEGACY_KEYS.some((key) => isRecord(first.current.toolPrefs) && key in first.current.toolPrefs)) patch(collect());
  }, [hydrated, patch]);
  useEffect(() => {
    if (!loaded.current) return;
    const flat = prefsOfSettings(settings);
    const now = useToolPrefsStore.getState();
    if (flat.openOnHover !== now.openOnHover || flat.holdMs !== now.holdMs || flat.springMs !== now.springMs) {
      now.patch({ openOnHover: flat.openOnHover, holdMs: flat.holdMs, springMs: flat.springMs });
    }
    if (flat.shareBrush !== useToolStore.getState().shareBrush) useToolStore.getState().setShareBrush(flat.shareBrush);
  }, [settings.toolOpenOnHover, settings.toolHoldMs, settings.toolSpringMs, settings.toolShareBrush]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const save = (): void => {
      if (!loaded.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const next = collect();
        const text = JSON.stringify(next);
        if (text === saved.current) return;
        saved.current = text;
        patch(next);
      }, SAVE_DELAY_MS);
    };
    const offs = [useToolStore.subscribe(save), useSelectionStore.subscribe(save), useToolPrefsStore.subscribe(save), useToolPresetStore.subscribe(save)];
    return () => {
      clearTimeout(timer);
      offs.forEach((off) => off());
    };
  }, [patch]);
};

export { useToolPersistence };
