/* @layer core @kind logic */
import type { FormatFailure } from './format.type';

const isFormatFailure = (value: object): value is FormatFailure => 'code' in value;

export { isFormatFailure };
