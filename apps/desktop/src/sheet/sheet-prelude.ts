/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_TARGET_SPRITES } from '@bxel/document';
import type { CommandStep, SheetId, SpriteId } from '@bxel/document';
import { freeName } from './free-name';
import { SHEET_NAME, SHEET_REF } from './sheet.constants';
import type { SheetItem, SheetModel, SheetPrelude } from './sheet.type';
import { spritesTarget } from './sprites-target';

const addSteps = (sheet: SheetId | { ref: string }, loose: readonly SheetItem[]): CommandStep[] =>
  Array.from({ length: Math.ceil(loose.length / MAX_TARGET_SPRITES) }, (_, chunk) => {
    const part = loose.slice(chunk * MAX_TARGET_SPRITES, (chunk + 1) * MAX_TARGET_SPRITES);
    return {
      name: COMMAND_NAME.sheetAdd,
      targets: spritesTarget(part.map((item) => item.sprite.id)),
      options: { sheet, places: part.map((item) => ({ at: item.at })) },
    };
  });

const sheetPrelude = (model: SheetModel, needed: readonly SpriteId[], sheetNames: readonly string[]): SheetPrelude => {
  const { sheet } = model;
  const loose = model.items.filter((item) => !item.onSheet && (sheet === null || needed.includes(item.sprite.id)));
  if (sheet) return { steps: addSteps(sheet.id, loose), sheet: sheet.id };
  const create: CommandStep = {
    name: COMMAND_NAME.sheetCreate,
    targets: null,
    options: { name: freeName(SHEET_NAME, sheetNames) },
    ref: SHEET_REF,
  };
  return { steps: [create, ...addSteps({ ref: SHEET_REF }, loose)], sheet: { ref: SHEET_REF } };
};

export { sheetPrelude };
