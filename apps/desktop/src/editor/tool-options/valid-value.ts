/* @layer renderer-app @kind logic */
import type { OptionSpec, OptionValue } from './tool-options.type';

const validValue = (spec: OptionSpec, value: unknown): OptionValue | undefined => {
  if (spec.kind === 'number') {
    const number = Number(value);
    if (!Number.isFinite(number)) return undefined;
    return Math.min(spec.max ?? number, Math.max(spec.min ?? number, Math.round(number)));
  }
  if (spec.kind === 'toggle') return typeof value === 'boolean' ? value : undefined;
  if (spec.kind === 'choice') return spec.choices?.find((choice) => choice.value === String(value))?.value;
  return undefined;
};

export { validValue };
