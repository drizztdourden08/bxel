/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { useProjectStore } from '../stores/useProjectStore';
import type { OpenProject } from './project.type';
import { releaseFolders } from './release-folders';
import { sameProject } from './same-project';

const handOverProject = (documents: DocumentsPort, next: OpenProject): void => {
  const { project: previous, held, setHeld } = useProjectStore.getState();
  setHeld(held.filter((each) => !sameProject(each, next)));
  if (previous && !sameProject(previous, next)) void releaseFolders(documents, previous);
};

export { handOverProject };
