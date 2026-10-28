/* @layer renderer-app @kind logic */
import { BUILTIN_PRESETS } from './builtin-presets.constants';
import type { ToolPreset } from './tool-preset.type';

const allPresets = (user: readonly ToolPreset[]): ToolPreset[] => [...BUILTIN_PRESETS, ...user];

export { allPresets };
