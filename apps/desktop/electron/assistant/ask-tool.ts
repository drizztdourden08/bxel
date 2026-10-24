/* @layer electron-main @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolCall, ToolReply } from '@bxel/mcp';
import { ASK_CHANNELS } from '../../src/ipc/contract.constants';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain } from './assistant.type';
import { toolReply } from './tool-reply';

const askTool = async (state: AssistantMain, call: ToolCall, timeoutMs: number): Promise<ToolReply> => {
  const ctx = state.ctx;
  const win = ctx?.window();
  if (!ctx || !win) return toolReply(mcpFailure(MCP_ERROR_CODE.APP_BUSY, MAIN_TEXT.busy));
  try {
    return await ctx.askWithin(timeoutMs, win, ASK_CHANNELS.assistantTool, call);
  } catch (error) {
    ctx.log(`assistant: ${call.tool} got no answer: ${error instanceof Error ? error.message : String(error)}`, 'warn');
    return toolReply(mcpFailure(MCP_ERROR_CODE.APP_BUSY, MAIN_TEXT.busy));
  }
};

export { askTool };
