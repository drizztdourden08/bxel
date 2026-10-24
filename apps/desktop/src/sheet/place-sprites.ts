/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Point, SpriteId } from '@bxel/document';
import { currentModel } from './current-model';
import { runDocument } from './run-document';
import { sheetPrelude } from './sheet-prelude';
import { SPRITE_LABEL } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const placeSprites = (ids: readonly SpriteId[], delta: Point): boolean => {
  const current = currentModel();
  if (!current || ids.length === 0 || (delta.x === 0 && delta.y === 0)) return false;
  const { artwork, model } = current;
  const prelude = sheetPrelude(model, ids, artwork.sheets.map((sheet) => sheet.name));
  const move = { name: COMMAND_NAME.sheetPlace, targets: spritesTarget(ids), options: { sheet: prelude.sheet, by: delta } };
  return runDocument(SPRITE_LABEL.place(ids.length), [...prelude.steps, move]) !== null;
};

export { placeSprites };
