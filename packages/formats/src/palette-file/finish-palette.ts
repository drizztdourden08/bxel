/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';

const finishPalette = (name: string, colors: readonly PaletteColor[]): PaletteReadResult => {
  if (colors.length === 0) return paletteInvalid('The file holds no colours');
  if (colors.length > PALETTE_LIMITS.MAX_COLORS) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_TOO_LARGE, `The palette holds more than ${PALETTE_LIMITS.MAX_COLORS} colours`);
  }
  return { ok: true, palette: { name, colors } };
};

export { finishPalette };
