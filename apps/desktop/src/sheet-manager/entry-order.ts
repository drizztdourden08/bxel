/* @layer renderer-app @kind logic */
import type { DropSide } from './drag-payload.type';

interface KeyMove {
  key: string;
  to: number;
}

const insertAt = (list: readonly string[], index: number, key: string): string[] => [...list.slice(0, index), key, ...list.slice(index)];

const slotOf = (rest: readonly string[], anchor: string | null, side: DropSide): number => {
  const at = anchor === null ? -1 : rest.indexOf(anchor);
  if (at < 0) return anchor === null && side === 'before' ? 0 : rest.length;
  return at + (side === 'after' ? 1 : 0);
};

/** The moves that put `moved` next to `anchor`, each a place in the list as it stands after the move before it. */
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

/** One step toward the start or the end for every key in `moved`; picked keys that meet keep their order. */
const shiftKeys = (list: readonly string[], moved: ReadonlySet<string>, by: number): string[] => {
  const out = [...list];
  const picked = out.map((key, index) => (moved.has(key) ? index : -1)).filter((index) => index >= 0);
  for (const index of by < 0 ? picked : [...picked].reverse()) {
    const next = index + Math.sign(by);
    const other = out[next];
    const here = out[index];
    if (other !== undefined && here !== undefined && !moved.has(other)) {
      out[next] = here;
      out[index] = other;
    }
  }
  return out;
};

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

export type { KeyMove };
export { keyMoves, shiftKeys, slotOf, wantedMoves };
