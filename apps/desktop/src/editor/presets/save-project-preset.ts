/* @layer renderer-app @kind logic */
import { editProjectPresets } from './edit-project-presets';
import type { ToolPreset } from './tool-preset.type';

const saveProjectPreset = (preset: ToolPreset): Promise<boolean> => {
  const stored = { id: preset.id, name: preset.name, member: preset.member, fields: { ...preset.fields } };
  return editProjectPresets((list) => (list.some((each) => each.id === stored.id) ? list.map((each) => (each.id === stored.id ? stored : each)) : [...list, stored]));
};

export { saveProjectPreset };
