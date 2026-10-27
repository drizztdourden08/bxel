/* @layer core @kind logic */
import type { BundleId } from '../catalogue/catalogue.type';
import { LEVEL_LABEL, LEVEL_RANK } from '../catalogue/level.constants';
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import type { ToolName } from '../tools/tool.type';
import { atLeast } from './at-least';
import { bundleLabel } from './bundle-label';
import { bundleLevel } from './bundle-level';
import { GRANT_TEXT } from './grant-text.constants';
import type { Grant } from './grant.type';
import { itemLevel } from './item-level';
import { toolLevel } from './tool-level';

type CommandItem = {
  readonly what: string;
  readonly area: BundleId;
  readonly changes: boolean;
};

const checkCommand = (grant: Grant, tool: ToolName, item: CommandItem, program: string = GRANT_TEXT.anyone): Failure | null => {
  const level = itemLevel(grant, tool, item.area);
  if (level === 'disabled') {
    return mcpFailure(MCP_ERROR_CODE.TOOL_DISABLED, GRANT_TEXT.stepOff(item.what, bundleLabel(item.area), program));
  }
  if (atLeast(level, item.changes ? 'edit' : 'read')) return null;
  const fromTool = LEVEL_RANK[toolLevel(grant, tool)] < LEVEL_RANK[bundleLevel(grant, item.area)];
  const toolBundle = bundleLabel(TOOL_CATALOGUE[tool].bundle);
  const overridden = grant.tools[tool] !== undefined;
  const text =
    fromTool && overridden
      ? GRANT_TEXT.needsTool(item.what, LEVEL_LABEL[level])
      : GRANT_TEXT.needsBundle(item.what, fromTool ? toolBundle : bundleLabel(item.area), LEVEL_LABEL[level]);
  return mcpFailure(MCP_ERROR_CODE.READ_LEVEL, `${text} ${GRANT_TEXT.where}`);
};

export { checkCommand };
export type { CommandItem };
