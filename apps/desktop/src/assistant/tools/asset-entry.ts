/* @layer renderer-app @kind logic */
import type { AssetRow } from '../../asset-list/asset-list.type';
import { fileName } from '../../files/file-name';
import { projectWorkspaceId } from '../../workspace/project-workspace-id';
import type { OpenProject } from '../../project/project.type';
import { organiseOf } from '../../organise/organise-of';
import type { AssetLinks } from './asset-states.type';
import { statesOf } from './asset-states';
import { locateInProject } from './locate-in-project';

const assetEntry = (project: OpenProject, row: AssetRow, links: AssetLinks | null) => ({
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
  tags: row.assetId === null ? [] : [...(organiseOf(project.manifest).tags[row.assetId] ?? [])],
  collections: organiseOf(project.manifest).collections.filter((each) => row.assetId !== null && each.assets.includes(row.assetId)).map((each) => each.name),
  pinned: row.assetId !== null && organiseOf(project.manifest).pinned.includes(row.assetId),
  states: [...statesOf(row, links)],
  uses: links === null ? null : [...links.uses],
  missingLinks: links === null ? null : links.missing.map((each) => ({ ...each })),
});

export { assetEntry };
