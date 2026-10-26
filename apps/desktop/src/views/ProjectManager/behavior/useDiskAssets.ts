/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { DEFAULT_QUERY } from '../../../asset-list/asset-list.constants';
import type { AssetChip, AssetSort } from '../../../asset-list/asset-list.type';
import { chipCounts } from '../../../asset-list/chip-counts';
import { queryRows } from '../../../asset-list/query-rows';
import { diskRows } from '../../../project-manager/disk-rows';
import type { DiskProject } from '../../../project-manager/project-manager.type';
import { READ_ONLY_ACTIONS } from '../ProjectManager.constants';
import type { AssetsModel } from '../../ProjectPanel/sub-components/AssetsView/AssetsView.type';

const useDiskAssets = (disk: DiskProject | null, search: string): AssetsModel => {
  const [chip, setChip] = useState<AssetChip>(DEFAULT_QUERY.chip);
  const [sort, setSort] = useState<AssetSort>(DEFAULT_QUERY.sort);
  const all = useMemo(() => (disk ? diskRows(disk) : []), [disk]);
  const query = useMemo(() => ({ chip, sort, search, usedBySprite: null }), [chip, sort, search]);
  const rows = useMemo(() => queryRows(all, query), [all, query]);
  const counts = useMemo(() => chipCounts(all, search), [all, search]);
  return { ...READ_ONLY_ACTIONS, rows, total: all.length, counts, query, usersOf: null, renaming: null, renameError: null, setChip, setSort };
};

export { useDiskAssets };
