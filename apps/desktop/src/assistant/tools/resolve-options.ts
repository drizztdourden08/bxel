/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { OptionSpec, OptionValue } from '../../editor/tool-options/tool-options.type';
import type { ToolId } from '../../editor/tool.type';
import { checkOptionValue } from './check-option-value';
import { specOfKey } from './tool-option-key';
import { viewFail } from './view-fail';

type Resolved = { readonly key: string; readonly spec: OptionSpec; readonly value: OptionValue };

const noOption = (key: string, tool: ToolId): string => `${key}: no option has this id for ${tool}. Call list_tools for the option ids.`;

const resolveOptions = (options: Readonly<Record<string, unknown>>, tool: ToolId, root: string): readonly Resolved[] | ToolReply => {
  const found: Resolved[] = [];
  for (const [key, given] of Object.entries(options)) {
    const spec = specOfKey(key, tool);
    if (!spec) return viewFail(noOption(key, tool), `${root}.${key}`);
    const checked = checkOptionValue(spec, given);
    if ('problem' in checked) return viewFail(`${key} ${checked.problem}`, `${root}.${key}`);
    found.push({ key, spec, value: checked.value });
  }
  return found.sort((a, b) => a.spec.priority - b.spec.priority);
};

export type { Resolved };
export { resolveOptions };
