/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { parseHexColor } from './parse-hex-color';
import type { PaletteFile } from './palette-file.type';
import { PALETTE_LIMITS } from './palette-limits.constants';

const parsePaletteColors = (palette: PaletteFile): number[][] | FormatFailure => {
  if (palette.colors.length > PALETTE_LIMITS.MAX_COLORS) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_TOO_LARGE, `A palette holds at most ${PALETTE_LIMITS.MAX_COLORS} colours`);
  }
  const parsed: number[][] = [];
  for (const color of palette.colors) {
    const rgba = parseHexColor(color.hex);
    if (!rgba) return formatFail(FORMAT_ERROR_CODE.PALETTE_INVALID_INPUT, `Invalid colour ${color.hex}`);
    parsed.push(rgba);
  }
  return parsed;
};

export { parsePaletteColors };
