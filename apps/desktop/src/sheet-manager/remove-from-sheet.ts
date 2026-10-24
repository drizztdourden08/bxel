/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SheetId, SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const removeFromSheet = (ids: readonly SpriteId[], sheetId: SheetId | null): boolean => {
  const sheet = currentArtwork()?.sheets.find((each) => each.id === sheetId);
  if (!sheet) return false;
  const onSheet = new Set(sheet.entries.map((entry) => entry.spriteId));
  const held = ids.filter((id) => onSheet.has(id));
  if (held.length === 0) return false;
  return runDocument(LABEL.removeFromSheet(held.length), spriteSteps(COMMAND_NAME.sheetRemove, held, { sheet: sheet.id })) !== null;
};

export { removeFromSheet };
