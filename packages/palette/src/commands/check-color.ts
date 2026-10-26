/* @layer core @kind logic */
import { ERROR_CODE, fail, parseSwatchColor } from '@bxel/document';
import type { SwatchColorValue } from '@bxel/document';

const checkColor = (value: string, path: string): SwatchColorValue => {
  const parsed = parseSwatchColor(value);
  if (parsed === null) throw fail(ERROR_CODE.INVALID_COLOR, `"${value}" is not a #rrggbb or #rrggbbaa colour.`, { path });
  return parsed;
};

export { checkColor };
