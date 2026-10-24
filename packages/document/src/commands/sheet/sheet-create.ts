/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { SheetId } from '../../model/ids.type';
import type { Sheet } from '../../model/sheet.type';
import { fillLayout } from '../../sheet/fill-layout';
import { NO_SPACING } from '../../sheet/sheet.constants';
import { sheetCreateSchema } from '../../schema/sheet-create-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const sheetCreate = defineCommand({
  name: COMMAND_NAME.sheetCreate,
  scope: 'none',
  schema: sheetCreateSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = checkName(options.name);
    assertNameFree(
      draft.artwork.sheets.map((sheet) => sheet.name),
      name,
    );
    const margin = options.margin ?? 0;
    const sheet: Sheet = {
      id: draft.ids.next('sht') as SheetId,
      name,
      created: draft.stamp,
      layout: fillLayout(options.layout ?? { kind: 'manual' }, [], margin),
      spacing: options.spacing ?? NO_SPACING,
      margin,
      entries: [],
    };
    updateArtwork(draft, (artwork) => ({ ...artwork, sheets: [...artwork.sheets, sheet] }));
    registerRef(draft, input.ref, sheet.id);
  },
});

export { sheetCreate };
