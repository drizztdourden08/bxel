/* @layer renderer-app @kind logic */
import { OPTION_SPECS } from './option-specs.constants';
import type { OptionSpec } from './tool-options.type';

const optionById = (id: string): OptionSpec | undefined => OPTION_SPECS.find((spec) => spec.id === id);

export { optionById };
