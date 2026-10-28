/* @layer renderer-app @kind logic */
import { MEMBER_OPTIONS } from '../tool-options/member-options.constants';
import { OPTION_SPECS } from '../tool-options/option-specs.constants';
import type { OptionSpec } from '../tool-options/tool-options.type';
import type { ToolId } from '../tool.type';

const presetFields = (tool: ToolId): OptionSpec[] =>
  OPTION_SPECS.filter((spec) => spec.tool === tool && spec.surface === 'paint' && spec.kind !== 'action' && !MEMBER_OPTIONS.includes(spec.id));

export { presetFields };
