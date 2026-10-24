/* @layer renderer-app @kind hook */
import { nav, useSettings } from '@drizztdourden08/brock-react';
import { NO_PRESETS } from '../../../export/export.constants';
import { PRESET_KINDS, PRESET_TEXT } from '../../../export/preset-list.constants';
import { removePreset } from '../../../export/remove-preset';
import { renamePreset } from '../../../export/rename-preset';
import { runPreset } from '../../../export/run-preset';
import type { AppSettings } from '../../../settings.type';
import type { PresetListModel } from '../AssetControl.type';

const usePresetList = (group: 'sprite' | 'sheet'): PresetListModel => {
  const { settings, patch } = useSettings<AppSettings>();
  const all = settings.exportPresets ?? NO_PRESETS;
  const rows = all
    .filter((preset) => PRESET_KINDS[group].includes(preset.settings.kind))
    .map((preset) => ({ name: preset.name, detail: PRESET_TEXT.detail(preset.settings.kind, preset.settings.scale) }));
  const rename = (from: string, to: string): string | null => {
    const edit = renamePreset(all, from, to);
    if (edit.ok) patch({ exportPresets: edit.presets });
    return edit.ok ? null : edit.message;
  };
  const remove = (name: string): void => patch({ exportPresets: removePreset(all, name) });
  const run = (name: string): void => {
    nav.close();
    runPreset(all, name);
  };
  return { rows, rename, remove, run };
};

export { usePresetList };
