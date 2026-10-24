/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';
import { saveManifest } from './save-manifest';
import { unlinkFolder } from './unlink-folder';

const removeLinkedFolder = (folderId: string): Promise<ProjectOutcome | null> => {
  const { project } = useProjectStore.getState();
  const folder = project?.folders.find((each) => each.folderId === folderId);
  const isRoot = project?.manifest.folders[0]?.folderId === folderId;
  if (!project || !folder || isRoot) return Promise.resolve({ ok: false, message: PROJECT_TEXT.unavailable });
  return runProjectTask(async (documents) => {
    const saved = await saveManifest(unlinkFolder(project.manifest, folderId));
    if (!saved.ok) return saved;
    useProjectStore.getState().setFolders(project.folders.filter((each) => each.folderId !== folderId));
    await documents.revokeFolder(folder.path).catch(() => false);
    toast(PROJECT_TEXT.linkedRemoved(folder.name), { variant: 'info' });
    return { ok: true };
  });
};

export { removeLinkedFolder };
