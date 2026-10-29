/* @layer renderer-app @kind logic */
import type { ExportPreset } from '@bxel/document';

const presetSummary = (preset: ExportPreset) => ({
  presetId: preset.id,
  name: preset.name,
  format: preset.format,
  scale: preset.scale,
  sheetId: preset.sheetId,
  pathTemplate: preset.pathTemplate,
});

export { presetSummary };
