/* @layer renderer-app @kind logic */
import { BUILTIN_PRESETS } from './builtin-presets.constants';
import { projectPresets } from './project-presets';
import type { ToolPreset } from './tool-preset.type';

const allPresets = (user: readonly ToolPreset[], project: readonly ToolPreset[] = projectPresets()): ToolPreset[] => [...BUILTIN_PRESETS, ...project, ...user];

export { allPresets };
