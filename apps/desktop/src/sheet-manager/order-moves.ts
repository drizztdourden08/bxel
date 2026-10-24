/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { OrderMove } from './manager.type';

const orderMoves = (current: readonly SpriteId[], wanted: readonly SpriteId[]): OrderMove[] => {
  const list = [...current];
  const moves: OrderMove[] = [];
  wanted.forEach((id, index) => {
    if (list[index] === id) return;
    list.splice(list.indexOf(id), 1);
    list.splice(index, 0, id);
    moves.push({ id, to: index });
  });
  return moves;
};

export { orderMoves };
