/* @layer core @kind logic */
import type { ExportPreset } from '@bxel/document';
import { sortKeys } from './sort-keys';

const orderExportPreset = (preset: ExportPreset) => ({
  id: preset.id,
  name: preset.name,
  format: preset.format,
  scale: preset.scale,
  scope: sortKeys(preset.scope),
  sheetId: preset.sheetId,
  pathTemplate: preset.pathTemplate,
  settings: sortKeys(preset.settings),
});

export { orderExportPreset };
