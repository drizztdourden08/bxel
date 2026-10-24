/* @layer renderer-app @kind logic */
import { DEFAULT_EXPORT_SETTINGS } from './export.constants';
import type { ExportSettings } from './export.type';
import { openExport } from './open-export';

const runPreset = (settings: ExportSettings): void => {
  const { folder: _folder, pathTemplate: _template, ...rest } = { ...DEFAULT_EXPORT_SETTINGS, ...settings };
  openExport(settings.kind, { ...rest, approved: false });
};

export { runPreset };
