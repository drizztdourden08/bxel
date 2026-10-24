/* @layer core @kind logic */
import { addWarning } from '../../draft/add-warning';
import type { Draft } from '../../draft/draft.type';
import type { SheetId } from '../../model/ids.type';
import { findSheet } from '../../read/find-sheet';
import { findOverlaps } from '../../sheet/find-overlaps';
import { MAX_OVERLAP_WARNINGS } from '../../sheet/sheet.constants';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { SHEET_WARNING } from '../../sheet/sheet-warning.constants';
import { requireSprite } from '../../read/require-sprite';

const warnOverlaps = (draft: Draft, sheetId: SheetId): void => {
  const sheet = findSheet(draft.artwork, sheetId);
  if (!sheet) return;
  const found = findOverlaps(sheet, sheetSizes(draft.artwork)).slice(0, MAX_OVERLAP_WARNINGS);
  for (const { first, second } of found) {
    const names = [requireSprite(draft.artwork, first).name, requireSprite(draft.artwork, second).name];
    addWarning(draft, SHEET_WARNING.overlap, `Sprites "${names[0]}" and "${names[1]}" overlap on sheet "${sheet.name}".`);
  }
};

export { warnOverlaps };
