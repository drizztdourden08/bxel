/* @layer renderer-app @kind logic */
import type { ExportPreset } from '@bxel/document';
import { DEFAULT_EXPORT_SETTINGS } from './export.constants';
import type { ExportSettings, SavedPreset } from './export.type';
import { KIND_LABEL } from './preset-list.constants';

const known = (preset: ExportPreset): Partial<ExportSettings> =>
  Object.fromEntries(
    Object.entries(DEFAULT_EXPORT_SETTINGS).flatMap(([key, fallback]) =>
      typeof preset.settings[key] === typeof fallback ? [[key, preset.settings[key]]] : [],
    ),
  );

const savedFromPreset = (preset: ExportPreset): SavedPreset => {
  const merged: ExportSettings = { ...DEFAULT_EXPORT_SETTINGS, ...known(preset), scale: preset.scale, folder: '', pathTemplate: '', approved: false };
  return { name: preset.name, settings: Object.hasOwn(KIND_LABEL, merged.kind) ? merged : { ...merged, kind: DEFAULT_EXPORT_SETTINGS.kind } };
};

export { savedFromPreset };
