/* @layer renderer-app @kind logic */
import type { AssetRow } from '../../asset-list/asset-list.type';
import { fileName } from '../../files/file-name';
import { projectWorkspaceId } from '../../workspace/project-workspace-id';
import type { OpenProject } from '../../project/project.type';
import { locateInProject } from './locate-in-project';

const assetEntry = (project: OpenProject, row: AssetRow) => ({
  kind: row.kind,
  id: row.assetId,
  name: row.name,
  fileName: row.path === '' ? null : fileName(row.path),
  location: row.path === '' ? null : locateInProject(project, row.path),
  dirty: row.dirty,
  opened: row.loaded,
  usedBy: [...row.usedBy],
  documentId: row.loaded ? projectWorkspaceId() : null,
  modifiedAt: row.modified > 0 ? new Date(row.modified).toISOString() : null,
});

export { assetEntry };
