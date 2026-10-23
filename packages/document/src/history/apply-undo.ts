/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import { applyOps } from './apply-ops';
import type { HistoryEntry } from './history.type';

const applyUndo = (project: Project, entry: HistoryEntry): Project => applyOps(project, entry.ops, 'undo');

export { applyUndo };
