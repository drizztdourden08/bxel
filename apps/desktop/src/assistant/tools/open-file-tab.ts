/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import { useProjectStore } from '../../stores/useProjectStore';
import { findAssetTab } from '../../workspace/find-asset-tab';
import type { OpenTab } from '../../workspace/workspace.type';

const openFileTab = (relPath: string): OpenTab | null => {
  const { project } = useProjectStore.getState();
  for (const folder of project?.folders ?? []) {
    const joined = joinInside(folder.path, relPath);
    const tab = joined.ok ? findAssetTab(joined.value) : null;
    if (tab !== null) return tab;
  }
  return null;
};

export { openFileTab };
