/* @layer renderer-app @kind logic */
import type { FolderId } from '@bxel/project';
import { applyProjectChange } from './apply-project-change';
import type { ProjectFocus, ProjectOutcomeText } from './project-config.type';

const setAssistantFolders = (focus: ProjectFocus, selected: readonly FolderId[]): Promise<ProjectOutcomeText> => {
  const { manifest } = focus.project;
  const all = manifest.folders.every((folder) => selected.includes(folder.folderId));
  const { access } = manifest.assistant;
  const assistant = all ? { access } : { access, folders: manifest.folders.map((folder) => folder.folderId).filter((id) => selected.includes(id)) };
  return applyProjectChange(focus, { ...manifest, assistant }, {});
};

export { setAssistantFolders };
