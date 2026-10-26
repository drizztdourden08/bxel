/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSheet } from '../../draft/update-sheet';
import type { Size } from '../../model/geometry.type';
import type { Sheet } from '../../model/sheet.type';
import { arrangeSheet } from '../../sheet/arrange-sheet';
import { fillLayout } from '../../sheet/fill-layout';
import { sheetSizes } from '../../sheet/sheet-sizes';
import { stripBoxes } from '../../sheet/strip-boxes';
import { EMPTY_SIZE } from '../../sheet/sheet.constants';
import type { Restyle } from './restyle.type';
import { warnOverlaps } from './warn-overlaps';

const restyleSheet = (draft: Draft, sheet: Sheet, change: Restyle): void => {
  const sizes = sheetSizes(draft.artwork);
  const boxes: Size[] = sheet.entries.map((entry) => sizes.get(entry.spriteId) ?? EMPTY_SIZE);
  const margin = change.margin ?? sheet.margin;
  const spacing = change.spacing ?? sheet.spacing;
  const layout = change.layout ? fillLayout(change.layout, boxes, margin, stripBoxes({ ...sheet, spacing }, draft.artwork.animations)) : sheet.layout;
  const next = arrangeSheet({ ...sheet, layout, spacing, margin }, sizes, draft.artwork.animations);
  updateSheet(draft, sheet.id, () => next);
  warnOverlaps(draft, sheet.id);
};

export { restyleSheet };
