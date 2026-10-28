/* @layer renderer-app @kind logic */
import { readOption } from './read-option';
import type { OptionSpec, OptionValue } from './tool-options.type';

const nextValue = (spec: OptionSpec): OptionValue | undefined => {
  const now = readOption(spec);
  if (spec.kind === 'toggle') return now !== true;
  if (spec.kind !== 'choice' || spec.choices === undefined) return undefined;
  const values = spec.choices.map((choice) => choice.value);
  return values[(values.indexOf(String(now)) + 1) % values.length];
};

export { nextValue };
