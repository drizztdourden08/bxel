/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import { useProjectStore } from '../../stores/useProjectStore';
import { findAssetTab } from '../../workspace/find-asset-tab';
import type { OpenFileHit } from './open-file-tab.type';

const openFileTab = (relPath: string): OpenFileHit | null => {
  const { project } = useProjectStore.getState();
  for (const folder of project?.folders ?? []) {
    const joined = joinInside(folder.path, relPath);
    const tab = joined.ok ? findAssetTab(joined.value) : null;
    if (joined.ok && tab !== null) return { tab, path: joined.value };
  }
  return null;
};

export { openFileTab };
