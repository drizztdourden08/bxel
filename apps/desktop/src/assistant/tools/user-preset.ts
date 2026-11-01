/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { ToolPreset } from '../../editor/presets/tool-preset.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { isReply } from './is-reply';
import { presetById } from './preset-by-id';
import { viewFail } from './view-fail';

const userPreset = (id: string): ToolPreset | ToolReply => {
  const found = presetById(id);
  return isReply(found) || found.builtin !== true ? found : viewFail(APP_TOOL_TEXT.builtinPreset, 'id');
};

export { userPreset };
