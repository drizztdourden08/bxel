/* @layer core @kind logic */
import type { PngFailure } from './png.type';

const isPngFailure = (value: object): value is PngFailure => 'code' in value;

export { isPngFailure };
