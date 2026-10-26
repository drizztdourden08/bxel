/* @layer core @kind logic */
import { ROLE_FALLBACK } from './project-document.constants';
import type { FolderRole, FolderRoles } from './project-document.type';

const resolveRole = (roles: FolderRoles, role: FolderRole): string | undefined => {
  const own = roles[role];
  if (own !== undefined) return own;
  const fallback = ROLE_FALLBACK[role];
  return fallback === undefined ? undefined : roles[fallback];
};

export { resolveRole };
