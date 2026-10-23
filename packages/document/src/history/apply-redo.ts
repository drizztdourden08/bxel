/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import { applyOps } from './apply-ops';
import type { HistoryEntry } from './history.type';

const applyRedo = (project: Project, entry: HistoryEntry): Project => applyOps(project, entry.ops, 'redo');

export { applyRedo };
