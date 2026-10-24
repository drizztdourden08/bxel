/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { NO_PRESETS } from '../export/export.constants';
import { presetEntries } from '../export/preset-entries';
import type { PresetEntry } from '../export/preset-entry.type';
import type { AppSettings } from '../settings.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { currentTab } from '../workspace/current-tab';
import { useActiveDocument } from './useActiveDocument';

const usePresetEntries = (): readonly PresetEntry[] => {
  const artwork = useActiveDocument()?.state.artwork ?? null;
  const { settings } = useSettings<AppSettings>();
  useWorkspaceStore((state) => state.activeTab);
  useWorkspaceStore((state) => state.tabs);
  return presetEntries(artwork, currentTab()?.key ?? null, settings.exportPresets ?? NO_PRESETS);
};

export { usePresetEntries };
