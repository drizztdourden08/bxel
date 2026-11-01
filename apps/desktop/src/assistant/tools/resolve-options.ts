/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { ToolId } from '../../editor/tool.type';
import { checkOptionValue } from './check-option-value';
import type { Resolved } from './resolve-options.type';
import { specOfKey } from './tool-option-key';
import { viewFail } from './view-fail';

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

export { resolveOptions };
