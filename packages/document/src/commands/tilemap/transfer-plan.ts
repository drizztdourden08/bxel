/* @layer core @kind logic */
import type { Point } from '../../model/geometry.type';
import type { CellMaskDescriptor } from '../../tilemap/cell-mask.type';
import { cellMaskBounds } from '../../tilemap/cell-mask-bounds';
import { resolveCellMask } from '../../tilemap/resolve-cell-mask';
import { transferCells } from '../../tilemap/transfer-cells';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { OpenedLayer } from './map-layer.type';
import type { TransferPlan } from './transfer-plan.type';

const transferPlan = (opened: OpenedLayer, from: CellMaskDescriptor, to: Point, empty: 'skip' | 'copy'): TransferPlan => {
  const { columns, rows } = opened.tilemap;
  const view = { columns, rows, cells: opened.layer.cells };
  const mask = resolveCellMask(from, view);
  const bounds = cellMaskBounds(mask, columns);
  if (!bounds) throw fail(ERROR_CODE.INVALID_OPTION, 'The described cells select nothing on this layer.', { path: 'options.from' });
  const { moved, outside } = transferCells({ view, mask, by: { x: to.x - bounds.x, y: to.y - bounds.y }, skipEmpty: empty === 'skip' });
  if (outside > 0) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, `${outside} of the cells would leave the ${columns} x ${rows} map.`, { path: 'options.to' });
  }
  return { mask, moved };
};

export { transferPlan };
