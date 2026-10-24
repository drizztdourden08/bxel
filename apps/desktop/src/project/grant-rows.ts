/* @layer renderer-app @kind logic */
import { grantAccess, isSamePath } from '@bxel/project';
import type { ProjectGrant, RecentProject } from '@bxel/project';
import type { GrantRow, OpenProject } from './project.type';

const isOpen = (open: OpenProject | null, entry: RecentProject): boolean =>
  open !== null && open.manifest.projectId === entry.projectId && isSamePath(open.rootRealPath, entry.rootRealPath);

const grantRows = (recents: readonly RecentProject[], grants: readonly ProjectGrant[], open: OpenProject | null): readonly GrantRow[] =>
  recents.map((entry) => ({
    projectId: entry.projectId,
    name: entry.name,
    rootRealPath: entry.rootRealPath,
    access: grantAccess(grants, entry.projectId, entry.rootRealPath),
    open: isOpen(open, entry),
    folders: isOpen(open, entry) && open ? open.folders.map((folder) => folder.path) : [entry.rootRealPath],
  }));

export { grantRows };
