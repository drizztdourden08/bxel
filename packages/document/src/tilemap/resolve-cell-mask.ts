/* @layer core @kind logic */
import { cellKey } from './cell-key';
import type { CellMaskDescriptor, CellView } from './cell-mask.type';
import { combineCellMasks } from './combine-cell-masks';
import { tileCells } from './tile-cells';
import { wandCells } from './wand-cells';

type BaseDescriptor = Exclude<CellMaskDescriptor, { by: 'combine' }>;

const rectMask = (view: CellView, rect: { x: number; y: number; width: number; height: number }): Uint8Array => {
  const out = new Uint8Array(view.columns * view.rows);
  const right = Math.min(rect.x + rect.width, view.columns);
  const bottom = Math.min(rect.y + rect.height, view.rows);
  for (let y = rect.y; y < bottom; y += 1) out.fill(1, y * view.columns + rect.x, y * view.columns + right);
  return out;
};

const listMask = (view: CellView, list: readonly { x: number; y: number }[]): Uint8Array => {
  const out = new Uint8Array(view.columns * view.rows);
  for (const cell of list) if (cell.x < view.columns && cell.y < view.rows) out[cell.y * view.columns + cell.x] = 1;
  return out;
};

const runsMask = (view: CellView, runs: readonly (readonly number[])[]): Uint8Array => {
  const out = new Uint8Array(view.columns * view.rows);
  for (const [row = 0, first = 0, last = 0] of runs) {
    if (row < view.rows && first < view.columns) out.fill(1, row * view.columns + first, row * view.columns + Math.min(last + 1, view.columns));
  }
  return out;
};

const sameMask =(view: CellView, at: { x: number; y: number }): Uint8Array => {
  const inside = at.x < view.columns && at.y < view.rows;
  return inside ? tileCells(view, cellKey(view.cells[at.y * view.columns + at.x] ?? 0)) : new Uint8Array(view.columns * view.rows);
};

const resolveBase = (descriptor: BaseDescriptor, view: CellView): Uint8Array => {
  if (descriptor.by === 'rect') return rectMask(view, descriptor.rect);
  if (descriptor.by === 'cells') return listMask(view, descriptor.cells);
  if (descriptor.by === 'runs') return runsMask(view, descriptor.runs);
  if (descriptor.by === 'wand') return wandCells(view, descriptor, descriptor.connectivity);
  return descriptor.by === 'same' ? sameMask(view, descriptor) : tileCells(view, descriptor.key);
};

const resolveCellMask = (descriptor: CellMaskDescriptor, view: CellView): Uint8Array => {
  if (descriptor.by !== 'combine') return resolveBase(descriptor, view);
  const [first, ...rest] = descriptor.of;
  if (!first) return new Uint8Array(view.columns * view.rows);
  return rest.reduce((joined, part) => combineCellMasks(joined, resolveBase(part, view), descriptor.op), resolveBase(first, view));
};

export { resolveCellMask };
