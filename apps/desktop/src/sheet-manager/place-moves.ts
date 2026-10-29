/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Sheet, SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { animationKey } from './animation-key';
import type { AlignMove } from './align.type';

const stepOf = (sheet: Sheet, move: AlignMove<string>): CommandStep => {
  const entry = (sheet.animationEntries ?? []).find((each) => animationKey(each.animationId, each.tagId) === move.id);
  if (!entry) {
    return { name: COMMAND_NAME.sheetPlace, targets: spritesTarget([move.id as SpriteId]), options: { sheet: sheet.id, at: move.at } };
  }
  return {
    name: COMMAND_NAME.sheetAnimationPlace,
    targets: null,
    options: { sheet: sheet.id, animation: entry.animationId, tag: entry.tagId ? { by: 'id', id: entry.tagId } : null, at: move.at },
  };
};

const placeMoves = (sheet: Sheet, moves: readonly AlignMove<string>[], label: (count: number) => string): boolean => {
  const steps = moves.map((move) => stepOf(sheet, move));
  return steps.length > 0 && runDocument(label(steps.length), steps) !== null;
};

export { placeMoves };
