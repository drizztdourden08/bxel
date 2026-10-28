/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { reply } from './reply';

const viewFail = (message: string, path?: string): ToolReply => reply(mcpFailure(MCP_ERROR_CODE.VIEW_INVALID, message, path === undefined ? {} : { path }));

export { viewFail };
