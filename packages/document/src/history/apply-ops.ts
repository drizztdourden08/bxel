/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import { applyOp } from './apply-op';
import { ORDER_PATH } from './entity-path.constants';
import type { HistoryDirection, UndoOp } from './history.type';

const isOrderOp = (op: UndoOp): boolean => op.kind === 'entity' && op.path === ORDER_PATH;

const applyOps = (project: Project, ops: readonly UndoOp[], direction: HistoryDirection): Project => {
  const sequence = direction === 'undo' ? [...ops].reverse() : [...ops];
  const ordered = [...sequence.filter((op) => !isOrderOp(op)), ...sequence.filter(isOrderOp)];
  return ordered.reduce((current, op) => applyOp(current, op, direction), project);
};

export { applyOps };
