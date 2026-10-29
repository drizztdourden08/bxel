/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { AssetRow } from '../../asset-list/asset-list.type';
import { organiseOf } from '../../organise/organise-of';
import { collectionsByAsset } from '../../project-browser/collections-by-asset';
import { factsAndKeys } from '../../project-browser/facts-and-keys';
import { matchEntry } from '../../project-browser/match-entry';
import { parseQuery } from '../../project-browser/parse-query';
import { NO_FACTS } from '../../project-browser/project-browser.constants';
import type { FileEntry } from '../../project-browser/project-browser.type';
import type { OpenProject } from '../../project/project.type';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';

const queryAssets = (rows: readonly AssetRow[], project: OpenProject, text: string): readonly AssetRow[] => {
  const query = parseQuery(text);
  const organise = organiseOf(project.manifest);
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project' && isSamePath(each.projectFile ?? '', project.projectFile));
  const artwork = workspace ? useDocumentStore.getState().host.view(workspace.documentId)?.state.artwork : undefined;
  const known = artwork ? factsAndKeys(artwork, rows, useWorkspaceStore.getState().tabs, organise) : null;
  const collected = collectionsByAsset(organise);
  const pinned = new Set(organise.pinned);
  return rows.filter((row) => {
    const base = known?.facts.get(row.id) ?? NO_FACTS;
    const facts = known || row.assetId === null ? base : { ...base, tags: organise.tags[row.assetId] ?? [], collections: collected.get(row.assetId) ?? [] };
    const entry: FileEntry = { kind: 'file', id: row.id, row, facts, pinned: row.assetId !== null && pinned.has(row.assetId), key: known?.keys.get(row.id) ?? null };
    return matchEntry(entry, query);
  });
};

export { queryAssets };
