/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { AssetRow } from '../../../asset-list/asset-list.type';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { ProjectManagerModel } from '../ProjectManager.type';
import { useDiskProject } from './useDiskProject';
import { useKnownProjects } from './useKnownProjects';
import { useManagerActions } from './useManagerActions';
import { useManagerAssets } from './useManagerAssets';
import { useProjectSelection } from './useProjectSelection';

const useProjectManager = (): ProjectManagerModel => {
  const known = useKnownProjects();
  const { selected, select } = useProjectSelection(known);
  const project = useProjectStore((state) => state.project);
  const open = selected?.open === true ? project : null;
  const disk = useDiskProject(selected);
  const [search, setSearch] = useState('');
  const { assets, editable } = useManagerAssets(open, disk, search);
  const [chosen, setChosen] = useState<string | null>(null);
  const actions = useManagerActions();
  const choose = useCallback((row: AssetRow | null) => setChosen(row?.id ?? null), []);
  const choice = chosen === null ? null : (assets.rows.find((row) => row.id === chosen) ?? null);
  const pick = useCallback(
    (key: string) => {
      setChosen(null);
      select(key);
    },
    [select],
  );
  return { known, selected, select: pick, open, disk, assets, editable, search, setSearch, choice, choose, actions };
};

export { useProjectManager };
