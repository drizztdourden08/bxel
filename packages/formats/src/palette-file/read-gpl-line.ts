/* @layer core @kind logic */
import type { FormatFailure } from '../failure/format.type';
import type { GplDraft } from './palette-draft.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';
import { parseRgbLine } from './parse-rgb-line';

const readGplLine = (draft: GplDraft, raw: string): FormatFailure | undefined => {
  const line = raw.trim();
  const { GPL_NAME_PREFIX, GPL_COLUMNS_PREFIX } = PALETTE_LIMITS;
  if (line === '' || line.startsWith('#') || line.startsWith(GPL_COLUMNS_PREFIX)) return undefined;
  if (line.startsWith(GPL_NAME_PREFIX)) {
    draft.name = line.slice(GPL_NAME_PREFIX.length).trim();
    return undefined;
  }
  const color = parseRgbLine(line);
  if (!color) return paletteInvalid(`Unreadable palette line: ${line}`);
  draft.colors.push(color);
  return undefined;
};

export { readGplLine };
