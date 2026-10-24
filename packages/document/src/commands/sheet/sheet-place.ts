/* @layer core @kind logic */
import { updateSheet } from '../../draft/update-sheet';
import { hasSheetEntry } from '../../draft/has-sheet-entry';
import type { Point } from '../../model/geometry.type';
import { MAX_SHEET_COORD } from '../../model/limits.constants';
import { sheetPlaceSchema } from '../../schema/sheet-place-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickSheet } from './pick-sheet';
import { warnOverlaps } from './warn-overlaps';

const inside = (point: Point): boolean => point.x >= 0 && point.y >= 0 && point.x <= MAX_SHEET_COORD && point.y <= MAX_SHEET_COORD;

const sheetPlace = defineCommand({
  name: COMMAND_NAME.sheetPlace,
  scope: 'sprites',
  schema: sheetPlaceSchema,
  run: (draft, input) => {
    const { at, by } = input.options;
    const sheet = pickSheet(draft, input.options.sheet);
    const moved = new Set(input.sprites);
    if (at && moved.size !== 1) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'At moves one sprite. Use by to move several.', { path: 'options.at' });
    }
    if (!input.sprites.every((spriteId) => hasSheetEntry(sheet, spriteId))) {
      throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Some target sprites are not on sheet "${sheet.name}".`);
    }
    const entries = sheet.entries.map((entry) => {
      if (!moved.has(entry.spriteId)) return entry;
      const next = at ?? { x: entry.at.x + (by?.x ?? 0), y: entry.at.y + (by?.y ?? 0) };
      if (!inside(next)) throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'A sprite cannot be placed outside the sheet.', { path: 'options' });
      return next.x === entry.at.x && next.y === entry.at.y ? entry : { ...entry, at: next };
    });
    const changed = entries.some((entry, index) => entry !== sheet.entries[index]);
    if (changed || sheet.layout.kind !== 'manual') {
      updateSheet(draft, sheet.id, (current) => ({ ...current, layout: { kind: 'manual' }, entries }));
    }
    warnOverlaps(draft, sheet.id);
  },
});

export { sheetPlace };
