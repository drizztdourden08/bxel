/* @layer renderer-app @kind logic */
import type { OptionSpec } from '../tool-options.type';
import type { NumberInput } from './drawing-spec.type';
import { specParts } from './spec-parts';

const numberSpec = (input: NumberInput): OptionSpec => ({
  ...specParts(input),
  kind: 'number',
  default: input.default,
  min: input.min,
  max: input.max,
  step: 1,
  read: input.read,
  write: (value) => input.write(Number(value)),
});

export { numberSpec };
