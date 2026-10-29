/* @layer core @kind logic */
import { LEVEL_LABEL } from '../catalogue/level.constants';
import { rowOf } from '../catalogue/row-of';
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { Failure } from '../errors/error.type';
import type { ToolName } from '../tools/tool.type';
import { atLeast } from './at-least';
import { bundleLabel } from './bundle-label';
import { checkStep } from './check-step';
import { GRANT_TEXT } from './grant-text.constants';
import type { Grant } from './grant.type';
import { needsEdit } from './needs-edit';
import { routedSteps } from './routed-steps';
import { toolLevel } from './tool-level';
import { tooLow } from './too-low';
import { turnedOff } from './turned-off';

const checkRouted = (grant: Grant, tool: ToolName, input: unknown, program: string): Failure | null => {
  for (const step of routedSteps(input)) {
    const failure = checkStep(grant, tool, step, program);
    if (failure) return failure;
  }
  return null;
};

const checkPlain = (grant: Grant, tool: ToolName, input: unknown): Failure | null => {
  const level = toolLevel(grant, tool, input);
  if (atLeast(level, needsEdit(tool, input) ? 'edit' : 'read')) return null;
  const row = rowOf(tool, input);
  const text =
    grant.tools[row] === undefined
      ? GRANT_TEXT.needsBundle(row, bundleLabel(TOOL_CATALOGUE[tool].bundle), LEVEL_LABEL[level])
      : GRANT_TEXT.needsTool(row, LEVEL_LABEL[level]);
  return tooLow(text);
};

const checkGrant = (tool: ToolName, input: unknown, grant: Grant, program: string = GRANT_TEXT.anyone): Failure | null => {
  if (grant.blocked || toolLevel(grant, tool, input) === 'disabled') {
    return turnedOff(GRANT_TEXT.toolOff(rowOf(tool, input), program));
  }
  const { routed, special } = TOOL_CATALOGUE[tool];
  if (special !== undefined && !grant.special[special]) return turnedOff(GRANT_TEXT.restartOff(tool, program));
  return routed === 'steps' ? checkRouted(grant, tool, input, program) : checkPlain(grant, tool, input);
};

export { checkGrant };
