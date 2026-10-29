/* @layer renderer-app @kind logic */
import type { OptionSpec } from '../tool-options.type';
import type { ToggleInput } from './drawing-spec.type';
import { specParts } from './spec-parts';

const toggleSpec = (input: ToggleInput): OptionSpec => ({
  ...specParts(input),
  kind: 'toggle',
  default: input.default ?? false,
  icon: input.icon ?? 'pixel-pixel-perfect',
  caption: input.label,
  read: input.read,
  write: (value) => input.write(value === true),
});

export { toggleSpec };
