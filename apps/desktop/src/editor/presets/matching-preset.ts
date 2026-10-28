/* @layer renderer-app @kind logic */
import { optionById } from '../tool-options/option-by-id';
import { readOption } from '../tool-options/read-option';
import type { ToolPreset } from './tool-preset.type';

const sameFields = (preset: ToolPreset): boolean =>
  Object.entries(preset.fields).every(([id, value]) => {
    const spec = optionById(id);
    return spec !== undefined && readOption(spec) === value;
  });

const matchingPreset = (presets: readonly ToolPreset[], memberId: string): ToolPreset | undefined =>
  presets.find((preset) => preset.member === memberId && sameFields(preset));

export { matchingPreset };
