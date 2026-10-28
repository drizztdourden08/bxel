/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { applyOptionSnapshot } from '../editor/tool-options/apply-option-snapshot';
import { optionSnapshot } from '../editor/tool-options/option-snapshot';
import { parsePrefs } from '../editor/tool-options/parse-prefs';
import { parseOptionValues } from '../editor/tool-options/parse-option-values';
import { parsePresets } from '../editor/tool-options/parse-presets';
import type { AppSettings } from '../settings.type';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useToolPrefsStore } from '../stores/useToolPrefsStore';
import { useToolPresetStore } from '../stores/useToolPresetStore';
import { useToolStore } from '../stores/useToolStore';

const SAVE_DELAY_MS = 400;

const collect = () => {
  const { openOnHover, holdMs, showKeys, hiddenMembers } = useToolPrefsStore.getState();
  const prefs = { openOnHover, holdMs, showKeys, hiddenMembers, shareBrush: useToolStore.getState().shareBrush };
  return { toolOptions: optionSnapshot(), toolPresets: useToolPresetStore.getState().user, toolPrefs: prefs };
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
    useToolPrefsStore.getState().patch({ openOnHover: prefs.openOnHover, holdMs: prefs.holdMs, showKeys: prefs.showKeys, hiddenMembers: prefs.hiddenMembers });
    useToolStore.getState().setShareBrush(prefs.shareBrush);
    useToolPresetStore.getState().load(parsePresets(first.current.toolPresets));
    applyOptionSnapshot(parseOptionValues(first.current.toolOptions));
    saved.current = JSON.stringify(collect());
    loaded.current = true;
  }, [hydrated]);
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
