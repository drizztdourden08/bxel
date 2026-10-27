/* @layer core @kind logic */
import type { Level } from '../catalogue/catalogue.type';
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { ToolName } from '../tools/tool.type';
import { bundleLevel } from './bundle-level';
import type { Grant } from './grant.type';

const toolLevel = (grant: Grant, tool: ToolName): Level => {
  const entry = TOOL_CATALOGUE[tool];
  return grant.tools[tool] ?? (entry.routed === undefined ? bundleLevel(grant, entry.bundle) : 'edit');
};

export { toolLevel };
