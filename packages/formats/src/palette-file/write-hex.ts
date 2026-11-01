/* @layer core @kind logic */
import { isFormatFailure } from '../failure/is-format-failure';
import { formatHexColor } from './format-hex-color';
import { HEX_TEXT } from './hex-text.constants';
import type { PaletteFile, PaletteTextResult } from './palette-file.type';
import { parsePaletteColors } from './parse-palette-colors';

const writeHex = (palette: PaletteFile): PaletteTextResult => {
  const parsed = parsePaletteColors(palette);
  if (isFormatFailure(parsed)) return parsed;
  const lines = parsed.map((rgba) =>
    formatHexColor(rgba[0] ?? 0, rgba[1] ?? 0, rgba[2] ?? 0, rgba[3] ?? 255).slice(HEX_TEXT.PREFIX.length),
  );
  return { ok: true, text: lines.map((line) => line + HEX_TEXT.BREAK).join('') };
};

export { writeHex };
