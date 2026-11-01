/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { gesture } from '../../editor/gesture-state';
import { isSpringTool } from '../../editor/tool-pick/is-spring-tool';
import { springFrom } from '../../editor/tool-pick/spring-from';
import { useToolStore } from '../../stores/useToolStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { commandFail } from './command-fail';

const toolBusy = (): ToolReply | null => {
  if (gesture.dragging) return commandFail(MCP_ERROR_CODE.TOOL_BUSY, APP_TOOL_TEXT.toolStroke, 'tool');
  const borrowed = springFrom.tool !== null && isSpringTool(useToolStore.getState().tool);
  return borrowed ? commandFail(MCP_ERROR_CODE.TOOL_BUSY, APP_TOOL_TEXT.toolBorrowed, 'tool') : null;
};

export { toolBusy };
