/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { openCreatedAsset } from '../new-sprite/open-created-asset';
import { freeName } from '../sheet/free-name';
import { runDocument } from '../sheet/run-document';
import { currentFocus } from './current-focus';
import { SHEET_SUFFIX } from './make-spritesheet.constants';
import { spritesheetSteps } from './spritesheet-steps';
import { TIMELINE_LABEL, TIMELINE_REF, TIMELINE_TEXT } from './timeline.constants';

const makeSpritesheet = async (): Promise<string | null> => {
  const focus = currentFocus();
  if (!focus) return null;
  const { animation, artwork, documentId } = focus;
  const name = freeName(`${animation.name}${SHEET_SUFFIX}`, artwork.sheets.map((sheet) => sheet.name));
  const done = runDocument(TIMELINE_LABEL.spritesheet, spritesheetSteps(animation, name));
  const id = done?.created[TIMELINE_REF.sheet];
  if (id === undefined) return null;
  toast(TIMELINE_TEXT.spritesheetDone(name), { variant: 'success' });
  const key: AssetKey = { kind: 'sheet', id };
  return openCreatedAsset(documentId, key);
};

export { makeSpritesheet };
