/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SheetId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { freeName } from '../sheet/free-name';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { NEW_SHEET_NAME } from './sheet-membership.constants';

const createSheet = (): SheetId | null => {
  const before = currentArtwork()?.sheets ?? [];
  const name = freeName(NEW_SHEET_NAME, before.map((sheet) => sheet.name));
  const step = { name: COMMAND_NAME.sheetCreate, targets: null, options: { name } };
  if (runDocument(LABEL.newSheet, [step]) === null) return null;
  const known = new Set(before.map((sheet) => sheet.id));
  return currentArtwork()?.sheets.find((sheet) => !known.has(sheet.id))?.id ?? null;
};

export { createSheet };
