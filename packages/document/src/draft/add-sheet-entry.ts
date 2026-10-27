/* @layer core @kind logic */
import type { SheetId, SpriteId } from '../model/ids.type';
import { appendPoint } from '../sheet/append-point';
import { arrangeSheet } from '../sheet/arrange-sheet';
import { sheetSizes } from '../sheet/sheet-sizes';
import type { Draft } from './draft.type';
import type { EntryPlace } from './entry-place.type';
import { updateSheet } from './update-sheet';

const addSheetEntry = (draft: Draft, sheetId: SheetId, spriteId: SpriteId, place: EntryPlace = {}): void => {
  const sizes = sheetSizes(draft.artwork);
  updateSheet(draft, sheetId, (sheet) => {
    const at = place.at ?? appendPoint(sheet, sizes);
    const grown = { ...sheet, entries: [...sheet.entries, { spriteId, at, source: place.source ?? null }] };
    return place.at ? grown : arrangeSheet(grown, sizes, draft.artwork.animations);
  });
};

export { addSheetEntry };
