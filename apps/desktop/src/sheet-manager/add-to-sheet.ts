/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SheetId, SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { freeName } from '../sheet/free-name';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { MEMBER_REF, NEW_SHEET_NAME } from './sheet-membership.constants';
import { spriteSteps } from './sprite-steps';

const addToSheet = (ids: readonly SpriteId[], sheetId: SheetId | null): boolean => {
  const artwork = currentArtwork();
  if (!artwork) return false;
  const sheet = artwork.sheets.find((each) => each.id === sheetId);
  const onSheet = new Set(sheet?.entries.map((entry) => entry.spriteId));
  const loose = ids.filter((id) => !onSheet.has(id));
  if (loose.length === 0) return false;
  const create: CommandStep[] = sheet
    ? []
    : [
        {
          name: COMMAND_NAME.sheetCreate,
          targets: null,
          options: { name: freeName(NEW_SHEET_NAME, artwork.sheets.map((each) => each.name)) },
          ref: MEMBER_REF,
        },
      ];
  const add = spriteSteps(COMMAND_NAME.sheetAdd, loose, { sheet: sheet ? sheet.id : { ref: MEMBER_REF } });
  return runDocument(LABEL.addToSheet(loose.length), [...create, ...add]) !== null;
};

export { addToSheet };
