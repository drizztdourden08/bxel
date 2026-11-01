/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import { allPresets } from '../../editor/presets/all-presets';
import type { ToolPreset } from '../../editor/presets/tool-preset.type';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';

const presetById = (id: string): ToolPreset | ToolReply => {
  const found = allPresets(useToolPresetStore.getState().user).find((each) => each.id === id);
  return found ?? viewFail(APP_TOOL_TEXT.noPreset(id), 'id');
};

export { presetById };
