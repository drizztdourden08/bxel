/* @layer helper @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { BRIDGE_CODES } from '@drizztdourden08/brock-electron/bridge';
import { fieldOf } from '../assistant-bridge/field-of';
import { HELPER_TEXT, NOT_RUNNING } from './helper.constants';

const bridgeFailure = (error: unknown): Failure => {
  const message = error instanceof Error ? error.message : String(error);
  if (fieldOf(error, 'code') === BRIDGE_CODES.timeout) return mcpFailure(MCP_ERROR_CODE.APP_BUSY, HELPER_TEXT.busy);
  if (NOT_RUNNING.test(message)) return mcpFailure(MCP_ERROR_CODE.BXEL_NOT_RUNNING, HELPER_TEXT.notRunning);
  return mcpFailure(MCP_ERROR_CODE.BRIDGE_ERROR, HELPER_TEXT.bridge(message));
};

export { bridgeFailure };
