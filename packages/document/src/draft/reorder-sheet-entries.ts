/* @layer core @kind logic */
import type { SheetId, SpriteId } from '../model/ids.type';
import { requireSheet } from '../read/require-sheet';
import { arrangeSheet } from '../sheet/arrange-sheet';
import { sheetSizes } from '../sheet/sheet-sizes';
import type { Draft } from './draft.type';
import type { OrderMove } from './order-move.type';
import { movedOrder } from './move-in-order';
import { sameOrder } from './same-order';
import { updateSheet } from './update-sheet';

const reorderSheetEntries = (draft: Draft, sheetId: SheetId, moved: ReadonlySet<SpriteId>, move: OrderMove): void => {
  const current = requireSheet(draft.artwork, sheetId).entries;
  const entries = movedOrder(current, (entry) => moved.has(entry.spriteId), move);
  if (sameOrder(entries, current)) return;
  const sizes = sheetSizes(draft.artwork);
  updateSheet(draft, sheetId, (sheet) => arrangeSheet({ ...sheet, entries: [...entries] }, sizes, draft.artwork.animations));
};

export { reorderSheetEntries };
