/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { valueWords } from './value-words';
import { validValue } from './valid-value';
import type { OptionSpec } from './tool-options.type';
import { writeOption } from './write-option';

const setOption = (spec: OptionSpec, value: unknown): boolean => {
  const next = validValue(spec, value);
  if (next === undefined) return false;
  writeOption(spec, next);
  announce(`${spec.label} ${valueWords(spec, next)}`);
  return true;
};

export { setOption };
