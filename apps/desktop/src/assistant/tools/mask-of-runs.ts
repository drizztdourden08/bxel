/* @layer renderer-app @kind logic */
import type { MaskView, Size } from '@bxel/raster';
import type { Runs } from './app-tool-input.type';

const fillRun = (bits: Uint8Array, size: Size, run: readonly [number, number, number]): void => {
  const [y, a, b] = run;
  if (y < 0 || y >= size.height) return;
  for (let x = Math.max(0, Math.min(a, b)); x <= Math.min(size.width - 1, Math.max(a, b)); x += 1) bits[y * size.width + x] = 1;
};

const maskOfRuns = (runs: Runs, size: Size): MaskView => {
  const bits = new Uint8Array(size.width * size.height);
  for (const run of runs) fillRun(bits, size, run);
  return { bits, width: size.width, height: size.height };
};

export { maskOfRuns };
