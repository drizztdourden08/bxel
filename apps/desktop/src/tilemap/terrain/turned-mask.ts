/* @layer renderer-app @kind logic */
import { NEIGHBOUR_STEPS } from '@bxel/document';
import type { CellFlags } from '@bxel/document';

const bitOf = (dx: number, dy: number): number => NEIGHBOUR_STEPS.find(([, x, y]) => x === dx && y === dy)?.[0] ?? 0;

const turnedMask = (mask: number, flags: CellFlags): number =>
  NEIGHBOUR_STEPS.reduce((next, [bit, dx, dy]) => {
    const x = flags.flipX ? -dx : dx;
    const y = flags.flipY ? -dy : dy;
    const source = flags.diagonal ? bitOf(y, x) : bitOf(x, y);
    return (mask & source) !== 0 ? next | bit : next;
  }, 0);

export { turnedMask };
