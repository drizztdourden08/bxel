/* @layer core @kind logic */
import { predictAt } from './predict-at';
import { PNG_FILTER } from './png-filter.constants';
import { rowView } from './row-view';
import type { RowGeometry } from './scanline.type';

const unfilterRow = (
  out: Uint8Array,
  raw: Uint8Array,
  geometry: RowGeometry,
  row: number,
): boolean => {
  const rawStart = row * (geometry.stride + 1);
  const type = raw[rawStart] ?? 0;
  if (type > PNG_FILTER.PAETH) return false;
  const view = rowView(out, geometry, row);
  for (let i = 0; i < geometry.stride; i += 1) {
    out[view.start + i] = ((raw[rawStart + 1 + i] ?? 0) + predictAt(type, view, i)) & 0xff;
  }
  return true;
};

export { unfilterRow };
