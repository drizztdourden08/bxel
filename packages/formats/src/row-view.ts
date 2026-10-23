/* @layer core @kind logic */
import type { PixelBytes } from './png.type';
import type { RowGeometry, RowView } from './scanline.type';

const rowView = (buf: PixelBytes, geometry: RowGeometry, row: number): RowView => ({
  buf,
  start: row * geometry.stride,
  prevStart: row > 0 ? (row - 1) * geometry.stride : -1,
  bpp: geometry.bpp,
});

export { rowView };
