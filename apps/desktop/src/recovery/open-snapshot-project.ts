/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { openProject } from '../project/open-project';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import type { Workspace } from '../workspace/workspace.type';

const projectWorkspace = (projectFile: string): Workspace | null =>
  Object.values(useWorkspaceStore.getState().workspaces).find(
    (workspace) => workspace.kind === 'project' && workspace.projectFile !== null && isSamePath(workspace.projectFile, projectFile),
  ) ?? null;

const openSnapshotProject = async (projectFile: string): Promise<Workspace | null> => {
  const open = projectWorkspace(projectFile);
  if (open !== null) return open;
  await openProject(parentOf(toSlashes(projectFile)), true);
  return projectWorkspace(projectFile);
};

export { openSnapshotProject };
