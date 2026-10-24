/* @layer renderer-app @kind logic */
import type { FolderRole, FolderRoles, ProjectDocument } from '@bxel/project';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { makeSubfolders } from '../project/make-subfolders';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { projectDirs } from '../workspace/project-dirs';
import { applyProjectChange } from './apply-project-change';
import type { ProjectFocus, ProjectOutcomeText } from './project-config.type';

const withRole = (manifest: ProjectDocument, folderId: string, role: FolderRole, path: string): ProjectDocument => ({
  ...manifest,
  folders: manifest.folders.map((folder) => {
    if (folder.folderId !== folderId) return folder;
    const kept = Object.fromEntries(Object.entries(folder.roles).filter(([each]) => each !== role)) as FolderRoles;
    return { ...folder, roles: path === '' ? kept : { ...kept, [role]: path } };
  }),
});

const refreshDirs = (focus: ProjectFocus): void => {
  const { project } = useProjectStore.getState();
  if (project && focus.documentId !== null) useWorkspaceStore.getState().patch(focus.documentId, (workspace) => ({ ...workspace, dirs: projectDirs(project) }));
};

const setRolePath = async (focus: ProjectFocus, change: { folderId: string; role: FolderRole; path: string }): Promise<ProjectOutcomeText> => {
  const next = withRole(focus.project.manifest, change.folderId, change.role, change.path.trim());
  const failed = await applyProjectChange(focus, next, {});
  if (failed !== null) return failed;
  const kit = fileKit();
  const { project } = useProjectStore.getState();
  try {
    if (kit && project) await makeSubfolders(kit.documents, project.rootRealPath, project.manifest);
  } catch (error) {
    return reasonOf(error);
  }
  refreshDirs(focus);
  return null;
};

export { setRolePath };
