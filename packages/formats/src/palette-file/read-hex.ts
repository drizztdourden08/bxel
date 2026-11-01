/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { formatHexColor } from './format-hex-color';
import { LINE_BREAK_PATTERN } from './line-break-pattern.constants';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';
import { parseHexColor } from './parse-hex-color';

const readHex = (text: string): PaletteReadResult => {
  const lines = text
    .replace(PALETTE_LIMITS.BOM, '')
    .split(LINE_BREAK_PATTERN)
    .map((line) => line.trim())
    .filter((line) => line !== '');
  const colors: PaletteColor[] = [];
  for (const line of lines) {
    const rgba = parseHexColor(line);
    if (!rgba) return paletteInvalid(`Unreadable palette line: ${line}`);
    colors.push({ hex: formatHexColor(rgba[0] ?? 0, rgba[1] ?? 0, rgba[2] ?? 0, rgba[3] ?? 255), name: '' });
  }
  if (colors.length === 0) return paletteInvalid('The file holds no colours');
  if (colors.length > PALETTE_LIMITS.MAX_COLORS) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_TOO_LARGE, `The palette holds more than ${PALETTE_LIMITS.MAX_COLORS} colours`);
  }
  return { ok: true, palette: { name: '', colors } };
};

export { readHex };
