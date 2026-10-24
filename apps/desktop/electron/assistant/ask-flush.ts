/* @layer electron-main @kind logic */
import { MCP_TIMEOUT_MS } from '@bxel/mcp';
import type { FlushReport } from '@bxel/mcp';
import { ASK_CHANNELS } from '../../src/ipc/contract.constants';
import type { AssistantMain } from './assistant.type';

const askFlush = async (state: AssistantMain, mode: 'recover' | 'discard' | 'check'): Promise<FlushReport> => {
  const ctx = state.ctx;
  const win = ctx?.window();
  if (!ctx || !win) return { unsaved: [] };
  try {
    return await ctx.askWithin(MCP_TIMEOUT_MS.saveExport, win, ASK_CHANNELS.assistantFlush, mode);
  } catch (error) {
    ctx.log(`assistant: the window did not report unsaved work: ${error instanceof Error ? error.message : String(error)}`, 'warn');
    return { unsaved: [] };
  }
};

export { askFlush };
