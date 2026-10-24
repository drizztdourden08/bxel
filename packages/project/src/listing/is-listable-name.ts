/* @layer core @kind logic */
import { isReservedFile } from '../paths/is-reserved-file';
import { isValidSegment } from '../paths/is-valid-segment';

const isListableName = (name: string): boolean => isValidSegment(name) && !isReservedFile(name);

export { isListableName };
