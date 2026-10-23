/* @layer core @kind logic */
import { predictAt } from './predict-at';
import type { PixelBytes } from './png.type';
import { rowView } from './row-view';
import type { RowGeometry } from './scanline.type';

const filterRow = (
  src: PixelBytes,
  geometry: RowGeometry,
  row: number,
  type: number,
): Uint8Array => {
  const view = rowView(src, geometry, row);
  const out = new Uint8Array(geometry.stride);
  for (let i = 0; i < geometry.stride; i += 1) {
    out[i] = ((src[view.start + i] ?? 0) - predictAt(type, view, i)) & 0xff;
  }
  return out;
};

export { filterRow };
