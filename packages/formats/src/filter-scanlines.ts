/* @layer core @kind logic */
import { filterRow } from './filter-row';
import { PNG_FILTER_ORDER } from './png-filter-order.constants';
import { PNG_FILTER } from './png-filter.constants';
import type { PixelBytes, PngFilterType } from './png.type';
import type { FilteredRow, RowGeometry } from './scanline.type';
import { scoreRow } from './score-row';

const bestRow = (src: PixelBytes, geometry: RowGeometry, row: number): FilteredRow => {
  let best: FilteredRow = { type: PNG_FILTER.NONE, bytes: filterRow(src, geometry, row, 0) };
  let bestScore = scoreRow(best.bytes);
  for (const type of PNG_FILTER_ORDER.slice(1)) {
    const bytes = filterRow(src, geometry, row, type);
    const score = scoreRow(bytes);
    if (score < bestScore) {
      best = { type, bytes };
      bestScore = score;
    }
  }
  return best;
};

const filterScanlines = (
  src: PixelBytes,
  geometry: RowGeometry,
  filter: PngFilterType | 'adaptive',
): Uint8Array => {
  const out = new Uint8Array(geometry.height * (geometry.stride + 1));
  for (let row = 0; row < geometry.height; row += 1) {
    const chosen =
      filter === 'adaptive'
        ? bestRow(src, geometry, row)
        : { type: filter, bytes: filterRow(src, geometry, row, filter) };
    const at = row * (geometry.stride + 1);
    out[at] = chosen.type;
    out.set(chosen.bytes, at + 1);
  }
  return out;
};

export { filterScanlines };
