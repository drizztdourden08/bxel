/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Sheet, SheetId, SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const leaveSteps = (sheet: Sheet, ids: readonly SpriteId[]): CommandStep[] => {
  const held = ids.filter((id) => sheet.entries.some((entry) => entry.spriteId === id));
  return held.length === 0 ? [] : spriteSteps(COMMAND_NAME.sheetRemove, held, { sheet: sheet.id });
};

const moveToSheet = (ids: readonly SpriteId[], target: SheetId): boolean => {
  const artwork = currentArtwork();
  const destination = artwork?.sheets.find((sheet) => sheet.id === target);
  if (!artwork || !destination) return false;
  const arriving = ids.filter((id) => !destination.entries.some((entry) => entry.spriteId === id));
  const leaving = artwork.sheets.filter((sheet) => sheet.id !== target).flatMap((sheet) => leaveSteps(sheet, ids));
  const steps = [...leaving, ...spriteSteps(COMMAND_NAME.sheetAdd, arriving, { sheet: target })];
  return steps.length > 0 && runDocument(LABEL.moveToSheet(ids.length), steps) !== null;
};

export { moveToSheet };
