/* @layer renderer-app @kind hook */
import { toast, useSettings } from '@drizztdourden08/brock-react';
import { DEFAULT_EXPORT_SETTINGS, NO_PRESETS } from '../../../export/export.constants';
import { PRESET_TEXT } from '../../../export/preset-list.constants';
import { savePreset } from '../../../export/save-preset';
import { upsertPreset } from '../../../export/upsert-preset';
import { usePresetEntries } from '../../../hooks/usePresetEntries';
import type { AppSettings } from '../../../settings.type';
import type { DraftModel, PresetModel } from '../ExportDialog.type';

const useExportPresets = ({ settings, replace }: DraftModel): PresetModel => {
  const { settings: app, patch } = useSettings<AppSettings>();
  const presets = usePresetEntries();
  const apply = (key: string): void => {
    const found = presets.find((preset) => preset.key === key);
    if (found) replace({ ...DEFAULT_EXPORT_SETTINGS, ...found.settings, folder: settings.folder, pathTemplate: settings.pathTemplate, approved: false });
  };
  const save = (name: string): void => {
    const trimmed = name.trim();
    if (trimmed === '') return;
    const saved = savePreset(trimmed, settings);
    if (saved?.ok) toast(PRESET_TEXT.savedIn(trimmed, saved.where), { variant: 'info' });
    else if (saved) toast(PRESET_TEXT.saveFailed(saved.message), { variant: 'danger' });
    else {
      patch({ exportPresets: upsertPreset(app.exportPresets ?? NO_PRESETS, { name: trimmed, settings: { ...settings, folder: '', pathTemplate: '', approved: false } }) });
      toast(PRESET_TEXT.savedInApp(trimmed), { variant: 'info' });
    }
  };
  return { presets, apply, save };
};

export { useExportPresets };
