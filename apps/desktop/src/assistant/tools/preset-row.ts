/* @layer renderer-app @kind logic */
import { matchingPreset } from '../../editor/presets/matching-preset';
import { presetSummary } from '../../editor/presets/preset-summary';
import type { ToolPreset } from '../../editor/presets/tool-preset.type';

const presetRow = (preset: ToolPreset) => ({
  id: preset.id,
  name: preset.name,
  member: preset.member,
  builtin: preset.builtin === true,
  fields: preset.fields,
  summary: presetSummary(preset),
  active: matchingPreset([preset], preset.member) !== undefined,
});

export { presetRow };
