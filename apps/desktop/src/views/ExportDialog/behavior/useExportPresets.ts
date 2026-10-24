/* @layer renderer-app @kind hook */
import { nameKey } from '@bxel/document';
import { useSettings } from '@drizztdourden08/brock-react';
import { DEFAULT_EXPORT_SETTINGS, NO_PRESETS } from '../../../export/export.constants';
import { upsertPreset } from '../../../export/upsert-preset';
import type { AppSettings } from '../../../settings.type';
import type { DraftModel, PresetModel } from '../ExportDialog.type';

const useExportPresets = ({ settings, replace }: DraftModel): PresetModel => {
  const { settings: app, patch } = useSettings<AppSettings>();
  const presets = app.exportPresets ?? NO_PRESETS;
  const apply = (name: string): void => {
    const found = presets.find((preset) => nameKey(preset.name) === nameKey(name));
    if (found) replace({ ...DEFAULT_EXPORT_SETTINGS, ...found.settings, folder: settings.folder, pathTemplate: settings.pathTemplate, approved: false });
  };
  const save = (name: string): void => {
    const trimmed = name.trim();
    if (trimmed === '') return;
    patch({ exportPresets: upsertPreset(presets, { name: trimmed, settings: { ...settings, folder: '', pathTemplate: '', approved: false } }) });
  };
  return { presets, apply, save };
};

export { useExportPresets };
