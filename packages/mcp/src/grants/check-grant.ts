/* @layer core @kind logic */
import { LEVEL_LABEL } from '../catalogue/level.constants';
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import type { ToolName } from '../tools/tool.type';
import { atLeast } from './at-least';
import { bundleLabel } from './bundle-label';
import { checkStep } from './check-step';
import { GRANT_TEXT } from './grant-text.constants';
import type { Grant } from './grant.type';
import { needsEdit } from './needs-edit';
import { routedSteps } from './routed-steps';
import { toolLevel } from './tool-level';

const checkRouted = (grant: Grant, tool: ToolName, input: unknown, program: string): Failure | null => {
  for (const step of routedSteps(input)) {
    const failure = checkStep(grant, tool, step, program);
    if (failure) return failure;
  }
  return null;
};

const checkPlain = (grant: Grant, tool: ToolName, input: unknown): Failure | null => {
  const level = toolLevel(grant, tool);
  if (atLeast(level, needsEdit(tool, input) ? 'edit' : 'read')) return null;
  const text =
    grant.tools[tool] === undefined
      ? GRANT_TEXT.needsBundle(tool, bundleLabel(TOOL_CATALOGUE[tool].bundle), LEVEL_LABEL[level])
      : GRANT_TEXT.needsTool(tool, LEVEL_LABEL[level]);
  return mcpFailure(MCP_ERROR_CODE.READ_LEVEL, `${text} ${GRANT_TEXT.where}`);
};

const checkGrant = (tool: ToolName, input: unknown, grant: Grant, program: string = GRANT_TEXT.anyone): Failure | null => {
  if (grant.blocked || toolLevel(grant, tool) === 'disabled') {
    return mcpFailure(MCP_ERROR_CODE.TOOL_DISABLED, GRANT_TEXT.toolOff(tool, program));
  }
  return TOOL_CATALOGUE[tool].routed === undefined ? checkPlain(grant, tool, input) : checkRouted(grant, tool, input, program);
};

export { checkGrant };
