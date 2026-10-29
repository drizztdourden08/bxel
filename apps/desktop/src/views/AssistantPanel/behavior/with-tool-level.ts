/* @layer renderer-app @kind logic */
import { rowLevel, TOOL_ROWS } from '@bxel/mcp';
import type { Grant, Level, ToolRowId } from '@bxel/mcp';
import { omitTool } from './omit-tool';
import { shownLevel } from './shown-level';

const withToolLevel = (grant: Grant, tool: ToolRowId, level: Level): Grant => {
  const { kind } = TOOL_ROWS[tool];
  const followed = shownLevel(rowLevel({ ...grant, tools: {} }, tool), kind);
  if (shownLevel(level, kind) === followed) return omitTool(grant, tool);
  return { ...grant, tools: { ...grant.tools, [tool]: level } };
};

export { withToolLevel };
