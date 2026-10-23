/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import { formatHex } from '../format-hex';
import { parseHex } from '../parse-hex';

const checkColor = (value: string, path: string): Rgb => {
  const parsed = parseHex(value);
  if (parsed === null) throw fail(ERROR_CODE.INVALID_COLOR, `"${value}" is not a #rrggbb colour.`, { path });
  return formatHex(parsed) as Rgb;
};

export { checkColor };
