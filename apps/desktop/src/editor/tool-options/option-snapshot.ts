/* @layer renderer-app @kind logic */
import { OPTION_SPECS } from './option-specs.constants';
import { readOption } from './read-option';
import { stored } from './stored';
import type { OptionValue } from './tool-options.type';

const optionSnapshot = (): Record<string, OptionValue> =>
  Object.fromEntries(OPTION_SPECS.filter(stored).map((spec) => [spec.id, readOption(spec)]));

export { optionSnapshot };
