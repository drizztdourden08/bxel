/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import { applyCelRect } from './apply-cel-rect';
import { applyEntity } from './apply-entity';
import { applyRemap } from './apply-remap';
import type { HistoryDirection, UndoOp } from './history.type';

const applyOp = (project: Project, op: UndoOp, direction: HistoryDirection): Project => {
  switch (op.kind) {
    case 'cel-rect':
      return applyCelRect(project, op, direction);
    case 'cel-remap':
      return applyRemap(project, op, direction);
    case 'entity':
      return applyEntity(project, op.path, direction === 'undo' ? op.before : op.after);
  }
};

export { applyOp };
