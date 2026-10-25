/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { TOOL_TEXT } from './tools.constants';

const lockedFailure = (): Failure => mcpFailure(MCP_ERROR_CODE.PROJECT_NOT_GRANTED, TOOL_TEXT.readOnlyProject);

export { lockedFailure };
