/* @layer renderer-app @kind logic */
import type { OptionSpec } from './tool-options.type';
import { writeOption } from './write-option';

const resetOption = (spec: OptionSpec): void => {
  if (spec.surface === 'paint' && spec.kind !== 'action') writeOption(spec, spec.default);
};

export { resetOption };
