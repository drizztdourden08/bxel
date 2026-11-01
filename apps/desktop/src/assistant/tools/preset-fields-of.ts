/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import { presetFields } from '../../editor/presets/preset-fields';
import type { OptionValue } from '../../editor/tool-options/tool-options.type';
import type { ToolId } from '../../editor/tool.type';
import { checkOptionValue } from './check-option-value';
import { viewFail } from './view-fail';

const presetFieldsOf = (tool: ToolId, given: Readonly<Record<string, unknown>>, root: string): Record<string, OptionValue> | ToolReply => {
  const allowed = presetFields(tool);
  const fields: Record<string, OptionValue> = {};
  for (const [key, value] of Object.entries(given)) {
    const spec = allowed.find((each) => each.id === key);
    if (!spec) return viewFail(`${key}: not an option a preset of ${tool} can hold. Valid: ${allowed.map((each) => each.id).join(', ')}.`, `${root}.${key}`);
    const checked = checkOptionValue(spec, value);
    if ('problem' in checked) return viewFail(`${key} ${checked.problem}`, `${root}.${key}`);
    fields[key] = checked.value;
  }
  return fields;
};

export { presetFieldsOf };
