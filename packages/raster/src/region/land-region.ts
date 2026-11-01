/* @layer core @kind logic */
import { diffBounds } from '@bxel/document';
import { assertSameSize } from '../assert-same-size';
import { coloursAdded } from '../resample/colours-added';
import type { Point } from '../geometry.type';
import type { LandOptions, LandResult, Lift } from './region.type';

const landPicked = (lift: Lift, at: Point, value: number): number => {
  if (lift.skipZero && value === 0) {
    return 0;
  }
  const { target } = lift;
  if (at.x < 0 || at.y < 0 || at.x >= target.width || at.y >= target.height) {
    return value === 0 ? 0 : 1;
  }
  target.pixels[at.y * target.width + at.x] = value;
  return 0;
};

const landCell = (lift: Lift, at: Point, from: number): number => landPicked(lift, at, lift.before[from] ?? 0);

const landRow = (lift: Lift, y: number): number => {
  const { area, source } = lift.resample;
  let clipped = 0;
  for (let x = area.x; x < area.x + area.width; x++) {
    if (lift.pick) {
      const value = lift.pick(x, y);
      if (value >= 0) {
        clipped += landPicked(lift, { x, y }, value);
      }
      continue;
    }
    const from = source(x, y);
    if (from >= 0) {
      clipped += landCell(lift, { x, y }, from);
    }
  }
  return clipped;
};

const landRegion = ({ target, mask, resample, skipZero, keep }: LandOptions): LandResult => {
  assertSameSize(target, mask);
  const before = target.pixels.slice();
  for (const [at, bit] of mask.bits.entries()) {
    if (bit !== 0 && !keep) {
      target.pixels[at] = 0;
    }
  }
  const lift: Lift = { target, before, resample, pick: resample.prepare ? resample.prepare(before) : null, skipZero };
  let clipped = 0;
  for (let y = resample.area.y; y < resample.area.y + resample.area.height; y++) {
    clipped += landRow(lift, y);
  }
  return { rect: diffBounds(before, target.pixels, target.width), clipped, added: resample.prepare ? coloursAdded(before, target.pixels) : null };
};

export { landRegion };
