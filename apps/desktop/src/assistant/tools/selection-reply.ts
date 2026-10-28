/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { runsOfMask } from './runs-of-mask';
import { RUNS_REPLY_MAX } from './selection-runs.constants';
import type { RunsReply } from './selection-runs.type';

const countOn = (mask: MaskView): number => mask.bits.reduce((sum, bit) => sum + (bit === 0 ? 0 : 1), 0);

const selectionReply = (mask: MaskView | null): RunsReply => {
  if (mask === null) return { empty: true, bounds: null, pixels: 0, runs: null };
  const bounds = maskBounds(mask);
  const runs = runsOfMask(mask);
  return { empty: bounds === null, bounds, pixels: countOn(mask), runs: runs.length > RUNS_REPLY_MAX ? null : runs };
};

export { selectionReply };
