/* @layer renderer-app @kind logic */
import type { FolderRole } from '@bxel/project';
import { toSlashes } from '../workspace/to-slashes';
import { focusedProject } from './focused-project';
import { folderRolePath } from './folder-role-path';
import { ROLE_FOLDER_TEXT } from './role-folder.constants';
import { setRolePath } from './set-role-path';
import type { ProjectOutcomeText } from './project-config.type';

const setFolderAsRole = async (folderPath: string, role: FolderRole): Promise<ProjectOutcomeText> => {
  const focus = focusedProject();
  if (focus === null) return ROLE_FOLDER_TEXT.noProject;
  const owner = focus.project.folders.find((each) => folderRolePath(each.path, folderPath) !== null);
  const path = owner === undefined ? null : folderRolePath(owner.path, toSlashes(folderPath));
  if (owner === undefined || path === null) return ROLE_FOLDER_TEXT.outside;
  return setRolePath(focus, { folderId: owner.folderId, role, path });
};

export { setFolderAsRole };
