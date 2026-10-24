/* @layer electron-main @kind logic */
import { MCP_ERROR_CODE, MCP_TIMEOUT_MS, mcpFailure } from '@bxel/mcp';
import type { PairOutcome, PairRequest } from '@bxel/mcp';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain } from './assistant.type';

const askPair = async (state: AssistantMain, request: PairRequest): Promise<PairOutcome> => {
  const ctx = state.ctx;
  const win = ctx?.window();
  if (!ctx || !win) return mcpFailure(MCP_ERROR_CODE.APP_BUSY, MAIN_TEXT.busy);
  try {
    return await ctx.askWithin(MCP_TIMEOUT_MS.pairing, win, APP_CHANNELS.assistantPair, request);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    ctx.log(`assistant: pairing got no answer: ${message}`, 'warn');
    return message.includes('timed out')
      ? mcpFailure(MCP_ERROR_CODE.PAIRING_TIMEOUT, MAIN_TEXT.timeout)
      : mcpFailure(MCP_ERROR_CODE.APP_BUSY, MAIN_TEXT.busy);
  }
};

export { askPair };
