/* @layer renderer-app @kind logic */
import type { Grant, ToolName } from '@bxel/mcp';

const omitTool = (grant: Grant, tool: ToolName): Grant => ({
  ...grant,
  tools: Object.fromEntries(Object.entries(grant.tools).filter(([key]) => key !== tool)),
});

export { omitTool };
