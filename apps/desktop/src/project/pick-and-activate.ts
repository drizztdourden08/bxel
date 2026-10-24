/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { activateProject } from './activate-project';
import { pickProjectFolder } from './pick-project-folder';
import type { ProjectOutcome } from './project.type';
import { readProjectFolder } from './read-project-folder';

const pickAndActivate = async (documents: DocumentsPort, startAt?: string): Promise<ProjectOutcome | null> => {
  const folder = await pickProjectFolder(documents, startAt);
  if (folder === null) return null;
  const loaded = await readProjectFolder(documents, folder);
  return loaded.ok ? activateProject(documents, folder, loaded.value) : { ok: false, message: loaded.message };
};

export { pickAndActivate };
