/* @layer renderer-app @kind constants */
import { TOOL_CATALOGUE } from '@bxel/mcp';
import type { ToolName } from '@bxel/mcp';

const TOOL_IDS = Object.keys(TOOL_CATALOGUE) as ToolName[];

export { TOOL_IDS };
