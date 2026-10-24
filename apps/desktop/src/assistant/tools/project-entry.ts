/* @layer renderer-app @kind logic */
import { effectiveAccess } from '@bxel/mcp';
import type { SessionAccess } from '@bxel/mcp';
import { ROOT_FOLDER_PATH } from '@bxel/project';
import type { FolderLocation } from '@bxel/project';
import type { GrantedProject } from '../assistant.type';

const locationOf = (location: FolderLocation) =>
  location.path === ROOT_FOLDER_PATH ? null : { folderId: location.folderId, path: location.path };

const projectEntry = ({ project, access, open }: GrantedProject, mode: SessionAccess) => ({
  projectId: project.manifest.projectId,
  name: project.manifest.name,
  access: effectiveAccess(mode, access) === 'edit' ? ('edit' as const) : ('read' as const),
  open,
  folders: project.folders.map((folder) => ({ folderId: folder.folderId, name: folder.name })),
  newFiles: locationOf(project.manifest.settings.newFiles),
  exports: locationOf(project.manifest.settings.exports),
});

export { projectEntry };
