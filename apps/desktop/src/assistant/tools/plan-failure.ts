/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';

const planFailure = (message: string, path: string): Failure =>
  mcpFailure(/already|exists/i.test(message) ? MCP_ERROR_CODE.FILE_EXISTS : MCP_ERROR_CODE.PATH_INVALID, message, { path });

export { planFailure };
