/* @layer renderer-app @kind logic */
import type { KeyMove } from './entry-order.type';

const wantedMoves = (current: readonly string[], wanted: readonly string[]): KeyMove[] => {
  const list = [...current];
  const moves: KeyMove[] = [];
  wanted.forEach((key, index) => {
    if (list[index] === key) return;
    list.splice(list.indexOf(key), 1);
    list.splice(index, 0, key);
    moves.push({ key, to: index });
  });
  return moves;
};

export { wantedMoves };
