/* @layer core @kind logic */
import { filterAverageLane } from './filter-average-lane';
import { filterPaethLane } from './filter-paeth-lane';
import { filterSubLane } from './filter-sub-lane';
import { filterUpLane } from './filter-up-lane';
import { PNG_FILTER } from './png-filter.constants';
import type { PixelBytes } from './png.type';
import type { FilterLanes, RowGeometry } from './scanline.type';

const runLane = (type: number, lanes: FilterLanes): void => {
  switch (type) {
    case PNG_FILTER.SUB:
      filterSubLane(lanes);
      break;
    case PNG_FILTER.UP:
      filterUpLane(lanes);
      break;
    case PNG_FILTER.AVERAGE:
      filterAverageLane(lanes);
      break;
    case PNG_FILTER.PAETH:
      filterPaethLane(lanes);
      break;
    default:
      lanes.out.set(lanes.cur);
  }
};

const filterRow = (src: PixelBytes, geometry: RowGeometry, row: number, type: number): Uint8Array => {
  const { stride, bpp } = geometry;
  const start = row * stride;
  const out = new Uint8Array(stride);
  const cur = src.subarray(start, start + stride);
  const up = row > 0 ? src.subarray(start - stride, start) : new Uint8Array(stride);
  runLane(type, { cur, up, out, bpp });
  return out;
};

export { filterRow };
