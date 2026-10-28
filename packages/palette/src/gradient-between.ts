/* @layer core @kind logic */
import { hexToOklch } from './hex-to-oklch';
import { FULL_TURN, HALF_TURN } from './oklab.constants';
import { oklchToHex } from './oklch-to-hex';

const gradientBetween = (from: string, to: string, count: number): string[] => {
  const start = hexToOklch(from);
  const end = hexToOklch(to);
  if (!start || !end || count < 1) return [];
  const turn = ((end.h - start.h + FULL_TURN + HALF_TURN) % FULL_TURN) - HALF_TURN;
  return Array.from({ length: count }, (_, at) => {
    const share = (at + 1) / (count + 1);
    return oklchToHex({
      l: start.l + (end.l - start.l) * share,
      c: start.c + (end.c - start.c) * share,
      h: (start.h + turn * share + FULL_TURN) % FULL_TURN,
    });
  });
};

export { gradientBetween };
