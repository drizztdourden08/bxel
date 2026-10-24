/* @layer renderer-app @kind logic */
import { NAME_TEXT, SIZE_RANGE } from './sprite-name.constants';

const inRange = (value: number): boolean => Number.isInteger(value) && value >= SIZE_RANGE.min && value <= SIZE_RANGE.max;

const sizeError = (width: number, height: number): string | null => (inRange(width) && inRange(height) ? null : NAME_TEXT.size);

export { sizeError };
