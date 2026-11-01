/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { gesture } from '../../editor/gesture-state';
import { useSpringStore } from '../../editor/tool-pick/behavior/useSpringStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { commandFail } from './command-fail';

const toolBusy = (): ToolReply | null => {
  if (gesture.dragging) return commandFail(MCP_ERROR_CODE.TOOL_BUSY, APP_TOOL_TEXT.toolStroke, 'tool');
  return useSpringStore.getState().borrowed !== null ? commandFail(MCP_ERROR_CODE.TOOL_BUSY, APP_TOOL_TEXT.toolBorrowed, 'tool') : null;
};

export { toolBusy };
