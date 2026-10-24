/* @layer core @kind logic */
import { diffBounds } from '@bxel/document';
import { assertSameSize } from '../assert-same-size';
import type { Point } from '../geometry.type';
import type { LandOptions, LandResult, Lift } from './region.type';

const landCell = ({ target, before, skipZero }: Lift, at: Point, from: number): number => {
  const value = before[from] ?? 0;
  if (skipZero && value === 0) {
    return 0;
  }
  if (at.x < 0 || at.y < 0 || at.x >= target.width || at.y >= target.height) {
    return value === 0 ? 0 : 1;
  }
  target.pixels[at.y * target.width + at.x] = value;
  return 0;
};

const landRow = (lift: Lift, y: number): number => {
  const { area, source } = lift.resample;
  let clipped = 0;
  for (let x = area.x; x < area.x + area.width; x++) {
    const from = source(x, y);
    if (from >= 0) {
      clipped += landCell(lift, { x, y }, from);
    }
  }
  return clipped;
};

const landRegion = ({ target, mask, resample, skipZero }: LandOptions): LandResult => {
  assertSameSize(target, mask);
  const before = target.pixels.slice();
  for (const [at, bit] of mask.bits.entries()) {
    if (bit !== 0) {
      target.pixels[at] = 0;
    }
  }
  const lift: Lift = { target, before, resample, skipZero };
  let clipped = 0;
  for (let y = resample.area.y; y < resample.area.y + resample.area.height; y++) {
    clipped += landRow(lift, y);
  }
  return { rect: diffBounds(before, target.pixels, target.width), clipped };
};

export { landRegion };
