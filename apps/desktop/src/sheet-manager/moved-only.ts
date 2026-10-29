/* @layer renderer-app @kind logic */
import type { AlignBox, AlignMove } from './align.type';

const movedOnly = <Id extends string>(boxes: readonly AlignBox<Id>[], moves: readonly AlignMove<Id>[]): AlignMove<Id>[] =>
  moves.filter((move) => {
    const box = boxes.find((each) => each.id === move.id);
    return box !== undefined && (box.x !== move.at.x || box.y !== move.at.y);
  });

export { movedOnly };
