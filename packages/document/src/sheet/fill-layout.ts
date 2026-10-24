/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { SheetLayout } from '../model/sheet.type';
import type { LayoutRequest } from './layout-request.type';

const biggest = (sizes: readonly Size[], side: 'width' | 'height'): number =>
  Math.max(1, ...sizes.map((size) => size[side]));

const packedWidth = (sizes: readonly Size[], margin: number): number => {
  const area = sizes.reduce((sum, size) => sum + size.width * size.height, 0);
  const wanted = 2 ** Math.ceil(Math.log2(Math.max(2, Math.sqrt(area) + 2 * margin)));
  return Math.max(wanted, biggest(sizes, 'width') + 2 * margin);
};

const fillLayout = (request: LayoutRequest, sizes: readonly Size[], margin: number): SheetLayout => {
  if (request.kind === 'manual') return { kind: 'manual' };
  if (request.kind === 'packed') return { kind: 'packed', maxWidth: request.maxWidth ?? packedWidth(sizes, margin) };
  return {
    kind: 'grid',
    columns: request.columns ?? Math.max(1, Math.ceil(Math.sqrt(sizes.length))),
    cellWidth: request.cellWidth ?? biggest(sizes, 'width'),
    cellHeight: request.cellHeight ?? biggest(sizes, 'height'),
    order: request.order ?? 'rows',
  };
};

export { fillLayout };
