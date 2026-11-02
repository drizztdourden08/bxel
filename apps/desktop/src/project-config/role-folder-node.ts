/* @layer renderer-app @kind logic */
import { FOLDER_ROLES } from '@bxel/project';
import type { MenuNode } from '@drizztdourden08/tessera';
import { ROLE_FOLDER_LABEL, ROLE_FOLDER_TEXT } from './role-folder.constants';
import type { RoleFolderOptions } from './role-folder.type';
import { setFolderAsRole } from './set-folder-as-role';

const roleFolderNode = ({ folderPath, current, report }: RoleFolderOptions): MenuNode => ({
  id: 'role-folder',
  label: ROLE_FOLDER_TEXT.menu,
  icon: 'folder',
  children: FOLDER_ROLES.map((role) => ({
    id: `role-folder:${role}`,
    label: ROLE_FOLDER_LABEL[role],
    kind: 'check',
    checked: current.includes(role),
    onSelect: () => void setFolderAsRole(folderPath, role).then((outcome) => report(outcome, role)),
  })),
});

export { roleFolderNode };
