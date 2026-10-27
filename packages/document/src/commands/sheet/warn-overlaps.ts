/* @layer core @kind logic */
import { addWarning } from '../../draft/add-warning';
import type { Draft } from '../../draft/draft.type';
import type { SheetId } from '../../model/ids.type';
import { findSheet } from '../../read/find-sheet';
import { findPartOverlaps } from '../../sheet/find-part-overlaps';
import { MAX_OVERLAP_WARNINGS } from '../../sheet/sheet.constants';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { SHEET_WARNING } from '../../sheet/sheet-warning.constants';
import { overlapMessage } from './overlap-message';

const warnOverlaps = (draft: Draft, sheetId: SheetId): void => {
  const sheet = findSheet(draft.artwork, sheetId);
  if (!sheet) return;
  const found = findPartOverlaps(sheet, sheetSizes(draft.artwork), draft.artwork.animations).slice(0, MAX_OVERLAP_WARNINGS);
  for (const overlap of found) addWarning(draft, SHEET_WARNING.overlap, overlapMessage(draft.artwork, sheet.name, overlap));
};

export { warnOverlaps };
