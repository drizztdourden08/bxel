/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { applyCelRect } from './apply-cel-rect';
import { applyEntity } from './apply-entity';
import { applyRemap } from './apply-remap';
import type { HistoryDirection, UndoOp } from './history.type';

const applyOp = (artwork: Artwork, op: UndoOp, direction: HistoryDirection): Artwork => {
  switch (op.kind) {
    case 'cel-rect':
      return applyCelRect(artwork, op, direction);
    case 'cel-remap':
      return applyRemap(artwork, op, direction);
    case 'entity':
      return applyEntity(artwork, op.path, direction === 'undo' ? op.before : op.after);
  }
};

export { applyOp };
