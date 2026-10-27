/* @layer renderer-app @kind logic */
import { TOOL_CATALOGUE, toolLevel } from '@bxel/mcp';
import type { Grant, Level, ToolName } from '@bxel/mcp';
import { omitTool } from './omit-tool';
import { shownLevel } from './shown-level';

const withToolLevel = (grant: Grant, tool: ToolName, level: Level): Grant => {
  const { kind } = TOOL_CATALOGUE[tool];
  const followed = shownLevel(toolLevel({ ...grant, tools: {} }, tool), kind);
  if (shownLevel(level, kind) === followed) return omitTool(grant, tool);
  return { ...grant, tools: { ...grant.tools, [tool]: level } };
};

export { withToolLevel };
