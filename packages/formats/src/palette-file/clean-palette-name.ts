/* @layer core @kind logic */
import { NAME_CONTROL_PATTERN } from './name-control-pattern.constants';

const cleanPaletteName = (name: string): string => name.replace(NAME_CONTROL_PATTERN, ' ').trim();

export { cleanPaletteName };
