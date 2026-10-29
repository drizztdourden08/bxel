/* @layer renderer-app @kind logic */
import type { OptionSpec } from '../tool-options.type';
import type { ChoiceInput } from './drawing-spec.type';
import { specParts } from './spec-parts';

const choiceSpec = (input: ChoiceInput): OptionSpec => {
  const { choices } = input;
  const own = {
    ...specParts(input),
    kind: 'choice' as const,
    default: input.default,
    read: input.read,
    write: (value: unknown) => input.write(String(value)),
  };
  if (typeof choices !== 'function') return { ...own, choices };
  return Object.defineProperty(own, 'choices', { get: choices, enumerable: true });
};

export { choiceSpec };
