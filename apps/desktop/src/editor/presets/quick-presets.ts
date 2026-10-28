/* @layer renderer-app @kind logic */
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import type { ToolId } from '../tool.type';
import { allPresets } from './all-presets';
import { QUICK_SLOTS } from './builtin-presets.constants';
import { presetsOfTool } from './presets-of-tool';
import type { ToolPreset } from './tool-preset.type';

const quickPresets = (tool: ToolId): ToolPreset[] => presetsOfTool(allPresets(useToolPresetStore.getState().user), tool).slice(0, QUICK_SLOTS);

export { quickPresets };
