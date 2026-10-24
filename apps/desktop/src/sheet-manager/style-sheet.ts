/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SheetId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import type { SheetStyle } from './manager.type';
import { sheetStyleOptions } from './sheet-style-options';

const styleSheet = (sheetId: SheetId | null, style: SheetStyle): boolean => {
  const sheet = currentArtwork()?.sheets.find((each) => each.id === sheetId);
  if (!sheet) return false;
  const step = { name: COMMAND_NAME.sheetUpdate, targets: null, options: sheetStyleOptions(sheet, style) };
  return runDocument(LABEL.sheetStyle, [step]) !== null;
};

export { styleSheet };
