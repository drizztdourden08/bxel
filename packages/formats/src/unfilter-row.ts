/* @layer core @kind logic */
import { PNG_FILTER } from './png-filter.constants';
import type { RowGeometry, UnfilterLanes } from './scanline.type';
import { unfilterAverageLane } from './unfilter-average-lane';
import { unfilterPaethLane } from './unfilter-paeth-lane';
import { unfilterSubLane } from './unfilter-sub-lane';
import { unfilterUpLane } from './unfilter-up-lane';

const runLane = (type: number, lanes: UnfilterLanes): void => {
  switch (type) {
    case PNG_FILTER.SUB:
      unfilterSubLane(lanes);
      break;
    case PNG_FILTER.UP:
      unfilterUpLane(lanes);
      break;
    case PNG_FILTER.AVERAGE:
      unfilterAverageLane(lanes);
      break;
    case PNG_FILTER.PAETH:
      unfilterPaethLane(lanes);
      break;
    default:
      lanes.out.set(lanes.raw);
  }
};

const unfilterRow = (out: Uint8Array, raw: Uint8Array, geometry: RowGeometry, row: number): boolean => {
  const { stride, bpp } = geometry;
  const rawStart = row * (stride + 1);
  const type = raw[rawStart] ?? 0;
  if (type > PNG_FILTER.PAETH) return false;
  const start = row * stride;
  const up = row > 0 ? out.subarray(start - stride, start) : new Uint8Array(stride);
  runLane(type, { raw: raw.subarray(rawStart + 1, rawStart + 1 + stride), up, out: out.subarray(start, start + stride), bpp });
  return true;
};

export { unfilterRow };
