/* @layer renderer-app @kind logic */
import type { OptionSpec, OptionValue } from './tool-options.type';

const valueWords = (spec: OptionSpec, value: OptionValue): string => {
  if (spec.kind === 'toggle') return value === true ? 'on' : 'off';
  if (spec.kind === 'choice') return spec.choices?.find((choice) => choice.value === String(value))?.label ?? String(value);
  return String(value);
};

export { valueWords };
