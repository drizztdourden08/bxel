/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Sheet } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import type { AlignMove } from './align.type';

const placeMoves = (sheet: Sheet, moves: readonly AlignMove[], label: (count: number) => string): boolean => {
  const steps = moves.map((move) => ({
    name: COMMAND_NAME.sheetPlace,
    targets: spritesTarget([move.id]),
    options: { sheet: sheet.id, at: move.at },
  }));
  return steps.length > 0 && runDocument(label(steps.length), steps) !== null;
};

export { placeMoves };
