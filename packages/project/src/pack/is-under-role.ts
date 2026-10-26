/* @layer core @kind logic */
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import { resolveRole } from '../project-document/resolve-role';
import type { FolderRole, DocumentFolder } from '../project-document/project-document.type';

const isUnderRole = (folder: DocumentFolder, role: FolderRole, path: string): boolean => {
  const rolePath = resolveRole(folder.roles, role)?.toLowerCase();
  if (rolePath === undefined || rolePath === ROOT_FOLDER_PATH) return false;
  const lower = path.toLowerCase();
  return lower === rolePath || lower.startsWith(`${rolePath}/`);
};

export { isUnderRole };
