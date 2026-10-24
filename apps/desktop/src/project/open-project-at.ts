/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { activateProject } from './activate-project';
import { pickAndActivate } from './pick-and-activate';
import type { ProjectOutcome } from './project.type';
import { readProjectFolder } from './read-project-folder';

const openProjectAt = async (documents: DocumentsPort, dir: string): Promise<ProjectOutcome | null> => {
  const direct = await readProjectFolder(documents, dir).catch(() => null);
  return direct?.ok ? activateProject(documents, dir, direct.value) : pickAndActivate(documents, dir);
};

export { openProjectAt };
