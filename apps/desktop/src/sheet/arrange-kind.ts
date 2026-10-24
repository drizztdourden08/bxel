/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentModel } from './current-model';
import { runDocument } from './run-document';
import { sheetPrelude } from './sheet-prelude';
import type { ArrangeKind } from './sheet.type';
import { SPRITE_LABEL } from './sprite-label.constants';

const arrangeKind = (kind: ArrangeKind): boolean => {
  const current = currentModel();
  if (!current) return false;
  const { artwork, model } = current;
  const prelude = sheetPrelude(model, artwork.sprites.map((sprite) => sprite.id), artwork.sheets.map((sheet) => sheet.name));
  const step = { name: COMMAND_NAME.sheetArrange, targets: null, options: { sheet: prelude.sheet, layout: { kind } } };
  return runDocument(SPRITE_LABEL.arrange[kind], [...prelude.steps, step]) !== null;
};

export { arrangeKind };
