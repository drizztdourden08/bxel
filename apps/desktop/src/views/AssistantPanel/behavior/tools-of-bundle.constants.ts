/* @layer renderer-app @kind constants */
import { TOOL_ROWS } from '@bxel/mcp';
import type { ToolRowId } from '@bxel/mcp';

const TOOL_IDS = Object.keys(TOOL_ROWS) as ToolRowId[];

export { TOOL_IDS };
