/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import { DEFAULT_EXPORT_SETTINGS } from './export.constants';
import type { SavedPreset } from './export.type';
import { openExport } from './open-export';

const runPreset = (presets: readonly SavedPreset[], name: string): boolean => {
  const found = presets.find((preset) => nameKey(preset.name) === nameKey(name));
  if (!found) return false;
  const { folder: _folder, pathTemplate: _template, ...rest } = { ...DEFAULT_EXPORT_SETTINGS, ...found.settings };
  openExport(found.settings.kind, { ...rest, approved: false });
  return true;
};

export { runPreset };
