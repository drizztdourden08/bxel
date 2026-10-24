/* @layer renderer-app @kind logic */
import { dropRecentProject, isSamePath, setGrant } from '@bxel/project';
import type { RecentProject } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';
import { releaseFolders } from './release-folders';

const withdrawGrant = (entry: RecentProject): void => {
  const { port } = useProjectStore.getState();
  if (!port) return;
  const { projectRecents, assistantProjects } = port.read();
  const off = { projectId: entry.projectId, rootRealPath: entry.rootRealPath, access: 'off' as const, grantedAt: new Date().toISOString() };
  port.patch({ projectRecents: dropRecentProject(projectRecents, entry.rootRealPath), assistantProjects: setGrant(assistantProjects, off) });
};

const releaseHeld = async (entry: RecentProject): Promise<void> => {
  const { held, setHeld } = useProjectStore.getState();
  const found = held.find((each) => isSamePath(each.rootRealPath, entry.rootRealPath));
  const kit = fileKit();
  if (!found || !kit) return;
  setHeld(held.filter((each) => each !== found));
  await releaseFolders(kit.documents, found);
};

const removeRecentProject = async (entry: RecentProject): Promise<void> => {
  withdrawGrant(entry);
  await releaseHeld(entry);
  await fileKit()?.documents.forgetFolder(entry.rootRealPath).catch(() => false);
  toast(PROJECT_TEXT.removedFromList(entry.name), { variant: 'info' });
};

export { removeRecentProject };
