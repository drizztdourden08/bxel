/* @layer renderer-app @kind logic */
import { isRecord } from '../editor/tool-options/is-record';
import { optionById } from '../editor/tool-options/option-by-id';
import type { OptionTarget } from './option-target.type';

const optionTarget = (args: unknown): OptionTarget | undefined => {
  if (!isRecord(args) || typeof args.option !== 'string') return undefined;
  const tool = typeof args.tool === 'string' ? args.tool : '';
  const spec = optionById(args.option) ?? optionById(`${tool}.${args.option}`);
  return spec ? { spec, value: args.value } : undefined;
};

export { optionTarget };
