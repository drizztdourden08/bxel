/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { DEFAULT_QUERY } from '../../../../../asset-list/asset-list.constants';
import type { AssetChip, AssetRow, AssetSort } from '../../../../../asset-list/asset-list.type';
import { buildRows } from '../../../../../asset-list/build-rows';
import { chipCounts } from '../../../../../asset-list/chip-counts';
import { copyForSheet } from '../../../../../asset-list/copy-for-sheet';
import { duplicateRow } from '../../../../../asset-list/duplicate-row';
import { exportRow } from '../../../../../asset-list/export-row';
import { openRow } from '../../../../../asset-list/open-row';
import { queryRows } from '../../../../../asset-list/query-rows';
import { revealRow } from '../../../../../asset-list/reveal-row';
import { trashRow } from '../../../../../asset-list/trash-row';
import type { OpenProject } from '../../../../../project/project.type';
import { useDocumentStore } from '../../../../../stores/useDocumentStore';
import { useWorkspaceStore } from '../../../../../stores/useWorkspaceStore';
import type { AssetsModel } from '../AssetsView.type';
import { useAssetFiles } from './useAssetFiles';
import { useAssetRename } from './useAssetRename';

const useAssetsView = (project: OpenProject | null, search: string): AssetsModel => {
  const workspace = useWorkspaceStore((state) => Object.values(state.workspaces).find((each) => each.kind === 'project'));
  const artwork = useDocumentStore((state) => (workspace ? state.views[workspace.documentId]?.state.artwork : undefined));
  const files = useAssetFiles(project);
  const [chip, setChip] = useState<AssetChip>(DEFAULT_QUERY.chip);
  const [sort, setSort] = useState<AssetSort>(DEFAULT_QUERY.sort);
  const [usersOf, showUsers] = useState<AssetRow | null>(null);
  const renames = useAssetRename();

  const all = useMemo(() => (workspace && artwork ? buildRows({ workspace, artwork, files }) : []), [workspace, artwork, files]);
  const query = useMemo(() => ({ chip, sort, search, usedBySprite: usersOf?.assetId ?? null }), [chip, sort, search, usersOf]);
  const rows = useMemo(() => queryRows(all, query), [all, query]);
  const counts = useMemo(() => chipCounts(all, search), [all, search]);

  return {
    ...renames,
    rows,
    total: all.length,
    counts,
    query,
    usersOf,
    setChip,
    setSort,
    showUsers,
    open: openRow,
    reveal: revealRow,
    duplicate: duplicateRow,
    trash: trashRow,
    copyForSheet,
    exportRow,
  };
};

export { useAssetsView };
