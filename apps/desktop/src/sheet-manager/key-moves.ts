/* @layer renderer-app @kind logic */
import type { DropSide } from './drag-payload.type';
import type { KeyMove } from './entry-order.type';
import { slotOf } from './slot-of';

const insertAt = (list: readonly string[], index: number, key: string): string[] => [...list.slice(0, index), key, ...list.slice(index)];

const keyMoves = (current: readonly string[], moved: readonly string[], anchor: string | null, side: DropSide): KeyMove[] => {
  const moves: KeyMove[] = [];
  let list = [...current];
  let near = { key: anchor, side };
  for (const key of moved) {
    if (!list.includes(key)) continue;
    const rest = list.filter((each) => each !== key);
    const to = slotOf(rest, near.key, near.side);
    moves.push({ key, to });
    list = insertAt(rest, to, key);
    near = { key, side: 'after' };
  }
  return moves;
};

export { keyMoves };
