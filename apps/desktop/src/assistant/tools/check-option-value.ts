/* @layer renderer-app @kind logic */
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';
import type { Checked } from './check-option-value.type';

const rangeText = (spec: OptionSpec): string => (spec.min === undefined || spec.max === undefined ? '' : ` from ${spec.min} to ${spec.max}`);

const outOfRange = (spec: OptionSpec, value: number): boolean => (spec.min !== undefined && value < spec.min) || (spec.max !== undefined && value > spec.max);

const numberOf = (spec: OptionSpec, value: unknown): Checked => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return { problem: `must be a number${rangeText(spec)}.` };
  if (!Number.isInteger(value)) return { problem: 'must be a whole number.' };
  if (outOfRange(spec, value)) return { problem: `must be from ${spec.min ?? 'any'} to ${spec.max ?? 'any'}, not ${value}.` };
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

export { checkOptionValue };
