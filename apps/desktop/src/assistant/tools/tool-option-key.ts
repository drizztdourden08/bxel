/* @layer renderer-app @kind logic */
import { optionById } from '../../editor/tool-options/option-by-id';
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';
import type { ToolId } from '../../editor/tool.type';
import { LEGACY_OPTION_KEYS } from './tool-option-key.constants';

const specOfKey = (key: string, tool: ToolId): OptionSpec | undefined => {
  const exact = optionById(key);
  if (exact) return exact;
  const named = LEGACY_OPTION_KEYS[key] ?? key;
  return optionById(named.includes('.') ? named : `${tool}.${named}`);
};

export { specOfKey };
