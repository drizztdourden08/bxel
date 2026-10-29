/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';

/** A refusal of a file operation plan, as the call's failure. A name that is taken is FILE_EXISTS; everything else is a path problem. */
const planFailure = (message: string, path: string): Failure =>
  mcpFailure(/already|exists/i.test(message) ? MCP_ERROR_CODE.FILE_EXISTS : MCP_ERROR_CODE.PATH_INVALID, message, { path });

export { planFailure };
