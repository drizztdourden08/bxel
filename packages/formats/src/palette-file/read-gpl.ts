/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { LINE_BREAK_PATTERN } from './line-break-pattern.constants';
import type { GplDraft } from './palette-draft.type';
import type { PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';
import { readGplLine } from './read-gpl-line';

const readGpl = (text: string): PaletteReadResult => {
  const [first = '', ...rest] = text.split(LINE_BREAK_PATTERN);
  if (first.replace(PALETTE_LIMITS.BOM, '').trim() !== PALETTE_LIMITS.GPL_HEADER) {
    return paletteInvalid('Not a GIMP palette file');
  }
  const draft: GplDraft = { name: '', colors: [] };
  for (const line of rest) {
    const failure = readGplLine(draft, line);
    if (failure) return failure;
  }
  if (draft.colors.length > PALETTE_LIMITS.MAX_COLORS) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_TOO_LARGE, `The palette holds more than ${PALETTE_LIMITS.MAX_COLORS} colours`);
  }
  return { ok: true, palette: { name: draft.name, colors: draft.colors } };
};

export { readGpl };
