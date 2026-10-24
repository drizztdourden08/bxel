/* @layer core @kind logic */
import { SWATCH_SET_ID_REGEX } from './id.constants';
import type { SwatchSetId } from './id.type';

const isSwatchSetId = (value: unknown): value is SwatchSetId =>
  typeof value === 'string' && SWATCH_SET_ID_REGEX.test(value);

export { isSwatchSetId };
