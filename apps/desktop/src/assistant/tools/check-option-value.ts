/* @layer renderer-app @kind logic */
import type { OptionSpec, OptionValue } from '../../editor/tool-options/tool-options.type';

type Checked = { readonly value: OptionValue } | { readonly problem: string };

const numberOf = (spec: OptionSpec, value: unknown): Checked => {
  const { min, max } = spec;
  if (typeof value !== 'number' || !Number.isFinite(value)) return { problem: `must be a number${min === undefined || max === undefined ? '' : ` from ${min} to ${max}`}.` };
  if (!Number.isInteger(value)) return { problem: 'must be a whole number.' };
  if ((min !== undefined && value < min) || (max !== undefined && value > max)) return { problem: `must be from ${min ?? 'any'} to ${max ?? 'any'}, not ${value}.` };
  return { value };
};

const choiceOf = (spec: OptionSpec, value: unknown): Checked => {
  const values = (spec.choices ?? []).map((choice) => choice.value);
  const found = values.find((each) => each === String(value));
  return found === undefined ? { problem: `must be one of: ${values.join(', ')}.` } : { value: found };
};

const checkOptionValue = (spec: OptionSpec, value: unknown): Checked => {
  if (spec.kind === 'number') return numberOf(spec, value);
  if (spec.kind === 'toggle') return typeof value === 'boolean' ? { value } : { problem: 'must be true or false.' };
  if (spec.kind === 'choice') return choiceOf(spec, value);
  return { problem: `is an action, not a value. Run ${spec.command ?? 'its command'} with run_command.` };
};

export type { Checked };
export { checkOptionValue };
