/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';
import { linkFolder } from './link-folder';
import { PROJECT_TEXT } from './project.constants';
import type { OpenProject, ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';
import { saveManifest } from './save-manifest';

const commitLink = async (project: OpenProject, picked: string): Promise<ProjectOutcome> => {
  const linked = linkFolder(project, picked);
  if (!linked.ok) return { ok: false, message: linked.message };
  const saved = await saveManifest(linked.value.manifest);
  if (!saved.ok) return saved;
  useProjectStore.getState().setFolders([...project.folders, { ...linked.value.folder, granted: true }]);
  toast(PROJECT_TEXT.linkedAdded(linked.value.folder.name), { variant: 'success' });
  return { ok: true };
};

const addLinkedFolder = (): Promise<ProjectOutcome | null> => {
  const { project } = useProjectStore.getState();
  if (!project) return Promise.resolve({ ok: false, message: PROJECT_TEXT.unavailable });
  return runProjectTask(async (documents) => {
    const picked = await documents.openFolder({ title: PROJECT_TEXT.linkedPickTitle, defaultPath: project.rootRealPath });
    if (picked === null) return null;
    const outcome = await commitLink(project, picked);
    if (!outcome.ok && !project.folders.some((folder) => isSamePath(folder.path, picked))) await documents.revokeFolder(picked).catch(() => false);
    return outcome;
  });
};

export { addLinkedFolder };
