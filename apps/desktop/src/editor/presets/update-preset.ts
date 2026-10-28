/* @layer renderer-app @kind logic */
import { saveDraft } from './save-draft';
import type { ToolPreset } from './tool-preset.type';

const updatePreset = (preset: ToolPreset): boolean =>
  saveDraft({ member: preset.member, name: preset.name, ticked: Object.keys(preset.fields), replaces: preset.id }) !== null;

export { updatePreset };
