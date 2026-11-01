/* @layer renderer-app @kind logic */
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { removeProjectPreset } from './remove-project-preset';
import { saveProjectPreset } from './save-project-preset';
import type { ToolPreset } from './tool-preset.type';

const movePresetScope = async (preset: ToolPreset): Promise<boolean> => {
  const store = useToolPresetStore.getState();
  if (preset.project === true) {
    store.save({ id: preset.id.replace(/^project\./, 'user.'), name: preset.name, member: preset.member, fields: { ...preset.fields } });
    return removeProjectPreset(preset.id);
  }
  const saved = await saveProjectPreset({ ...preset, id: preset.id.replace(/^user\./, 'project.') });
  if (saved) store.remove(preset.id);
  return saved;
};

export { movePresetScope };
