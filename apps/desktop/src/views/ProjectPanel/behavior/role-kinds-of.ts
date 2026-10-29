/* @layer renderer-app @kind logic */
import type { RowKind } from '../../../asset-list/asset-list.type';
import type { OpenProject } from '../../../project/project.type';
import { projectDirs } from '../../../workspace/project-dirs';
import { toSlashes } from '../../../workspace/to-slashes';

const roleKindsOf = (project: OpenProject | null): ReadonlyMap<string, RowKind> => {
  const found = new Map<string, RowKind>();
  if (project === null) return found;
  for (const [kind, path] of Object.entries(projectDirs(project))) found.set(toSlashes(path).toLowerCase(), kind as RowKind);
  return found;
};

export { roleKindsOf };
