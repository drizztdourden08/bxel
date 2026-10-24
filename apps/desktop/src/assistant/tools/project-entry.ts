/* @layer renderer-app @kind logic */
import { effectiveAccess } from '@bxel/mcp';
import type { SessionAccess } from '@bxel/mcp';
import { ROOT_FOLDER_PATH } from '@bxel/project';
import type { FolderRole, ProjectDocument } from '@bxel/project';
import type { GrantedProject } from '../assistant.type';

const locationOf = (manifest: ProjectDocument, role: FolderRole) => {
  const folder = manifest.folders[0];
  const path = folder?.roles[role];
  return folder === undefined || path === undefined || path === ROOT_FOLDER_PATH ? null : { folderId: folder.folderId, path };
};

const projectEntry = ({ project, access, open }: GrantedProject, mode: SessionAccess) => ({
  projectId: project.manifest.projectId,
  name: project.manifest.name,
  access: effectiveAccess(mode, access) === 'edit' ? ('edit' as const) : ('read' as const),
  open,
  folders: project.folders.map((folder) => ({ folderId: folder.folderId, name: folder.name })),
  newFiles: locationOf(project.manifest, 'sprites'),
  exports: locationOf(project.manifest, 'exports'),
});

export { projectEntry };
