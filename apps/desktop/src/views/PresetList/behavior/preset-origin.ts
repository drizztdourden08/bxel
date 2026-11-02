/* @layer renderer-app @kind logic */
import type { ToolPreset } from '../../../editor/presets/tool-preset.type';
import { PRESET_TEXT } from '../PresetList.constants';

const presetOrigin = (preset: ToolPreset): string => {
  if (preset.builtin === true) return PRESET_TEXT.builtIn;
  if (preset.project === true) return PRESET_TEXT.inProject;
  return '';
};

export { presetOrigin };
