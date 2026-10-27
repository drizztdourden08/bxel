/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView, Size } from '@bxel/raster';
import type { Runs } from './app-tool-input.type';

const RUNS_REPLY_MAX = 20000;

type RunsReply = {
  readonly empty: boolean;
  readonly bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number } | null;
  readonly pixels: number;
  readonly runs: [number, number, number][] | null;
};

const runsOfMask = (mask: MaskView): [number, number, number][] => {
  const runs: [number, number, number][] = [];
  for (let y = 0; y < mask.height; y += 1) {
    let start = -1;
    for (let x = 0; x <= mask.width; x += 1) {
      const on = x < mask.width && (mask.bits[y * mask.width + x] ?? 0) !== 0;
      if (on && start < 0) start = x;
      if (!on && start >= 0) {
        runs.push([y, start, x - 1]);
        start = -1;
      }
    }
  }
  return runs;
};

const maskOfRuns = (runs: Runs, size: Size): MaskView => {
  const bits = new Uint8Array(size.width * size.height);
  for (const [y, from, to] of runs) {
    if (y < 0 || y >= size.height) continue;
    for (let x = Math.max(0, Math.min(from, to)); x <= Math.min(size.width - 1, Math.max(from, to)); x += 1) bits[y * size.width + x] = 1;
  }
  return { bits, width: size.width, height: size.height };
};

const countOn = (mask: MaskView): number => mask.bits.reduce((sum, bit) => sum + (bit === 0 ? 0 : 1), 0);

const selectionReply = (mask: MaskView | null): RunsReply => {
  if (mask === null) return { empty: true, bounds: null, pixels: 0, runs: null };
  const bounds = maskBounds(mask);
  const runs = runsOfMask(mask);
  return { empty: bounds === null, bounds, pixels: countOn(mask), runs: runs.length > RUNS_REPLY_MAX ? null : runs };
};

export { maskOfRuns, runsOfMask, selectionReply };
export type { RunsReply };
