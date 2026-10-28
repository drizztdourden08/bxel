/* @layer renderer-app @kind logic */
import type { ToolId } from '../tool.type';
import { OPTION_SPECS } from './option-specs.constants';
import type { OptionSpec } from './tool-options.type';
import { writeOption } from './write-option';

const resettable = (spec: OptionSpec): boolean => spec.surface === 'paint' && spec.kind !== 'action';

const resetOption = (spec: OptionSpec): void => {
  if (resettable(spec)) writeOption(spec, spec.default);
};

const resetTool = (tool: ToolId): void => OPTION_SPECS.filter((spec) => spec.tool === tool).forEach(resetOption);

const resetAllTools = (): void => OPTION_SPECS.forEach(resetOption);

export { resetAllTools, resetOption, resetTool };
