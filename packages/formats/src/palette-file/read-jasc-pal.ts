/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isIntegerIn } from '../pixels/is-integer-in';
import { LINE_BREAK_PATTERN } from './line-break-pattern.constants';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';
import { parseRgbLine } from './parse-rgb-line';

const readJascCount = (head: readonly string[]): number | FormatFailure => {
  const [header = '', version = '', declared = ''] = head;
  if (header !== PALETTE_LIMITS.JASC_HEADER || version !== PALETTE_LIMITS.JASC_VERSION) {
    return paletteInvalid('Not a JASC palette file');
  }
  const count = Number(declared);
  if (declared === '' || !isIntegerIn(count, 0, PALETTE_LIMITS.MAX_COLORS)) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_TOO_LARGE, 'The colour count is missing or out of range');
  }
  return count;
};

const readJascPal = (text: string): PaletteReadResult => {
  const lines = text
    .replace(PALETTE_LIMITS.BOM, '')
    .split(LINE_BREAK_PATTERN)
    .map((line) => line.trim());
  const count = readJascCount(lines.slice(0, 3));
  if (typeof count !== 'number') return count;
  const colors: PaletteColor[] = [];
  for (const line of lines.slice(3).filter((entry) => entry !== '').slice(0, count)) {
    const color = parseRgbLine(line);
    if (!color) return paletteInvalid(`Unreadable palette line: ${line}`);
    colors.push({ hex: color.hex, name: '' });
  }
  if (colors.length < count) {
    return paletteInvalid(`The file declares ${count} colours but holds ${colors.length}`);
  }
  return { ok: true, palette: { name: '', colors } };
};

export { readJascPal };
