/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { applyOp } from './apply-op';
import { ORDER_PATH } from './entity-path.constants';
import type { HistoryDirection, UndoOp } from './history.type';

const isOrderOp = (op: UndoOp): boolean => op.kind === 'entity' && op.path === ORDER_PATH;

const applyOps = (artwork: Artwork, ops: readonly UndoOp[], direction: HistoryDirection): Artwork => {
  const sequence = direction === 'undo' ? [...ops].reverse() : [...ops];
  const ordered = [...sequence.filter((op) => !isOrderOp(op)), ...sequence.filter(isOrderOp)];
  return ordered.reduce((current, op) => applyOp(current, op, direction), artwork);
};

export { applyOps };
