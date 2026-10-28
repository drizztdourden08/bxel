/* @layer renderer-app @kind logic */
import type { ToolId } from '../tool.type';
import { OPTION_SPECS } from './option-specs.constants';
import { resetOption } from './reset-option';

const resetTool = (tool: ToolId): void => OPTION_SPECS.filter((spec) => spec.tool === tool).forEach(resetOption);

export { resetTool };
