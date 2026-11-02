/* @layer renderer-app @kind logic */
import { FOLDER_ROLES } from '@bxel/project';
import type { FolderRole } from '@bxel/project';
import { toSlashes } from '../workspace/to-slashes';
import { focusedProject } from './focused-project';
import { folderRolePath } from './folder-role-path';

const clean = (path: string): string => toSlashes(path).replace(/^\/+|\/+$/g, '').toLowerCase();

const rolesOfFolder = (folderPath: string): readonly FolderRole[] => {
  const focus = focusedProject();
  if (focus === null) return [];
  const owner = focus.project.folders.find((each) => folderRolePath(each.path, folderPath) !== null);
  const relative = owner === undefined ? null : folderRolePath(owner.path, folderPath);
  const stored = owner === undefined ? undefined : focus.project.manifest.folders.find((each) => each.folderId === owner.folderId);
  if (relative === null || stored === undefined) return [];
  return FOLDER_ROLES.filter((role) => {
    const set = stored.roles[role];
    return set !== undefined && clean(set) === clean(relative);
  });
};

export { rolesOfFolder };
