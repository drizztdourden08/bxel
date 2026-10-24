/* @layer renderer-app @kind logic */
import { projectWorkspaceId } from '../workspace/project-workspace-id';
import { tabOf } from '../workspace/tab-of';
import type { OpenTab } from '../workspace/workspace.type';
import type { AssetRow } from './asset-list.type';

const rowTab = (row: AssetRow): OpenTab | null => {
  const documentId = projectWorkspaceId();
  if (documentId === null || !row.loaded || row.assetId === null || row.kind === 'image' || row.kind === 'other') return null;
  return tabOf(documentId, { kind: row.kind, id: row.assetId });
};

export { rowTab };
