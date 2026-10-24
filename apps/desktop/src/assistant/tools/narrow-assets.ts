/* @layer renderer-app @kind logic */
import { searchRows } from '../../asset-list/search-rows';
import { sortRows } from '../../asset-list/sort-rows';
import { usingRows } from '../../asset-list/using-rows';
import type { AssetRow } from '../../asset-list/asset-list.type';
import type { OpenProject } from '../../project/project.type';
import { locateInProject } from './locate-in-project';
import type { ListAssetsInput } from './tool-input.type';

const inFolder = (project: OpenProject, request: ListAssetsInput) => (row: AssetRow): boolean => {
  if (request.folderId === undefined) return true;
  const place = row.path === '' ? null : locateInProject(project, row.path);
  if (place?.folderId !== request.folderId) return false;
  return request.path === undefined || place.path.toLowerCase().startsWith(`${request.path.toLowerCase()}/`);
};

const narrowAssets = (rows: readonly AssetRow[], project: OpenProject, request: ListAssetsInput): readonly AssetRow[] => {
  const kinds = new Set<string>(request.kinds);
  const wanted = rows.filter((row) => kinds.has(row.kind)).filter(inFolder(project, request));
  return sortRows(usingRows(searchRows(wanted, request.search ?? ''), request.usedBy ?? null), 'name');
};

export { narrowAssets };
