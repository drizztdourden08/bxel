/* @layer renderer-app @kind logic */
import type { Grant, ToolRowId } from '@bxel/mcp';

const omitTool = (grant: Grant, tool: ToolRowId): Grant => ({
  ...grant,
  tools: Object.fromEntries(Object.entries(grant.tools).filter(([key]) => key !== tool)),
});

export { omitTool };
