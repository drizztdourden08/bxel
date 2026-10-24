/* @layer core @kind logic */
import { decodePng } from '../decode-png';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { byteAt } from '../pixels/byte-at';
import { formatHexColor } from './format-hex-color';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';

const readPalettePng = (bytes: Uint8Array): PaletteReadResult => {
  const png = decodePng(bytes);
  if (!png.ok) return paletteInvalid(png.message);
  const strip = png.width === 1 || png.height === 1;
  const seen = new Set<string>();
  const colors: PaletteColor[] = [];
  for (let i = 0; i < png.width * png.height; i += 1) {
    const at = i * 4;
    const hex = formatHexColor(
      byteAt(png.data, at),
      byteAt(png.data, at + 1),
      byteAt(png.data, at + 2),
      byteAt(png.data, at + 3),
    );
    if (strip || !seen.has(hex)) colors.push({ hex, name: '' });
    seen.add(hex);
  }
  if (colors.length > PALETTE_LIMITS.MAX_COLORS) {
    return formatFail(
      FORMAT_ERROR_CODE.PALETTE_TOO_LARGE,
      `The image holds more than ${PALETTE_LIMITS.MAX_COLORS} colours`,
    );
  }
  return { ok: true, palette: { name: '', colors } };
};

export { readPalettePng };
