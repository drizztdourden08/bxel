/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { useProjectSetsStore } from '../stores/useProjectSetsStore';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';
import { releaseFolders } from './release-folders';
import { sameProject } from './same-project';

const closeProject = async (): Promise<void> => {
  const { project, held, close, setHeld } = useProjectStore.getState();
  if (!project) return;
  close();
  setHeld(held.filter((each) => !sameProject(each, project)));
  useProjectSetsStore.getState().close();
  toast(PROJECT_TEXT.closed(project.manifest.name), { variant: 'info' });
  const kit = fileKit();
  if (kit) await releaseFolders(kit.documents, project);
};

export { closeProject };
