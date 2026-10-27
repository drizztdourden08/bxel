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
import type { RoutedStep } from './routed-steps.type';
import { toolLevel } from './tool-level';

const lowestBundle = (grant: Grant, tool: ToolName, step: RoutedStep): BundleId => {
  const [first = 'edit_pixels', ...rest] = step.bundles;
  return rest.reduce((worst, bundle) => (LEVEL_RANK[itemLevel(grant, tool, bundle)] < LEVEL_RANK[itemLevel(grant, tool, worst)] ? bundle : worst), first);
};

const checkStep = (grant: Grant, tool: ToolName, step: RoutedStep, program: string): Failure | null => {
  const bundle = lowestBundle(grant, tool, step);
  const level = itemLevel(grant, tool, bundle);
  const needed = TOOL_CATALOGUE[tool].kind === 'read' ? 'read' : 'edit';
  const what = `${tool} step ${step.index + 1} (${step.name || 'unnamed'})`;
  if (level === 'disabled') {
    return mcpFailure(MCP_ERROR_CODE.TOOL_DISABLED, GRANT_TEXT.stepOff(what, bundleLabel(bundle), program), { step: step.index });
  }
  if (atLeast(level, needed)) return null;
  const fromTool = LEVEL_RANK[toolLevel(grant, tool)] < LEVEL_RANK[bundleLevel(grant, bundle)];
  const text = fromTool ? GRANT_TEXT.needsTool(what, LEVEL_LABEL[level]) : GRANT_TEXT.needsBundle(what, bundleLabel(bundle), LEVEL_LABEL[level]);
  return mcpFailure(MCP_ERROR_CODE.READ_LEVEL, `${text} ${GRANT_TEXT.where}`, { step: step.index });
};

export { checkStep };
