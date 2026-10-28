/* @layer renderer-app @kind logic */
import { OPTION_SPECS } from './option-specs.constants';
import { resetOption } from './reset-option';

const resetAllTools = (): void => OPTION_SPECS.forEach(resetOption);

export { resetAllTools };
