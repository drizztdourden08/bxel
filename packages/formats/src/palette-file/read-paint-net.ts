/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { formatHexColor } from './format-hex-color';
import { LINE_BREAK_PATTERN } from './line-break-pattern.constants';
import { PAINT_NET } from './paint-net.constants';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';

const nameOf = (comment: string): string | undefined => {
  const body = comment.slice(PAINT_NET.COMMENT.length).trim();
  return body.startsWith(PAINT_NET.NAME_PREFIX) ? body.slice(PAINT_NET.NAME_PREFIX.length).trim() : undefined;
};

const colorOf = (line: string): PaletteColor => {
  const [a, r, g, b] = [0, 2, 4, 6].map((at) => Number.parseInt(line.slice(at, at + 2), 16));
  return { hex: formatHexColor(r ?? 0, g ?? 0, b ?? 0, a ?? 255), name: '' };
};

const readPaintNet = (text: string): PaletteReadResult => {
  const lines = text
    .replace(PALETTE_LIMITS.BOM, '')
    .split(LINE_BREAK_PATTERN)
    .map((line) => line.trim())
    .filter((line) => line !== '');
  let name = '';
  const colors: PaletteColor[] = [];
  for (const line of lines) {
    if (line.startsWith(PAINT_NET.COMMENT)) {
      name = nameOf(line) ?? name;
    } else if (PAINT_NET.LINE.test(line)) {
      colors.push(colorOf(line));
    } else {
      return paletteInvalid(`Unreadable palette line: ${line}`);
    }
  }
  if (colors.length === 0) return paletteInvalid('The file holds no colours');
  if (colors.length > PALETTE_LIMITS.MAX_COLORS) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_TOO_LARGE, `The palette holds more than ${PALETTE_LIMITS.MAX_COLORS} colours`);
  }
  return { ok: true, palette: { name, colors } };
};

export { readPaintNet };
