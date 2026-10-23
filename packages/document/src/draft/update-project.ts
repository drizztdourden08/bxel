/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import type { Draft } from './draft.type';

const updateProject = (draft: Draft, change: (project: Project) => Project): void => {
  draft.project = change(draft.project);
};

export { updateProject };
