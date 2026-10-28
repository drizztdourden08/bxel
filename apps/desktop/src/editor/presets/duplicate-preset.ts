/* @layer renderer-app @kind logic */
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import type { ToolPreset } from './tool-preset.type';

const duplicatePreset = (preset: ToolPreset): void => {
  const id = `user.${Date.now().toString(36)}.copy`;
  useToolPresetStore.getState().save({ id, name: `${preset.name} copy`, member: preset.member, fields: { ...preset.fields } });
};

export { duplicatePreset };
