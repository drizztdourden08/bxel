/* @layer core @kind logic */
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { ToolName } from '../tools/tool.type';

const needsEdit = (tool: ToolName, input: unknown): boolean => {
  const entry = TOOL_CATALOGUE[tool];
  if (entry.kind === 'write') return true;
  return entry.kind === 'mixed' && entry.writes?.(input) === true;
};

export { needsEdit };
