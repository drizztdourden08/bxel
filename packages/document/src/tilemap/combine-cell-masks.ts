/* @layer core @kind logic */
import type { CellMaskOp } from './cell-mask.type';

const inside = (a: boolean, b: boolean, op: CellMaskOp): boolean => {
  if (op === 'add') return a || b;
  return op === 'subtract' ? a && !b : a && b;
};

const combineCellMasks = (first: Uint8Array, second: Uint8Array, op: CellMaskOp): Uint8Array => {
  const out = new Uint8Array(first.length);
  for (let at = 0; at < out.length; at += 1) out[at] = inside(first[at] === 1, second[at] === 1, op) ? 1 : 0;
  return out;
};

export { combineCellMasks };
