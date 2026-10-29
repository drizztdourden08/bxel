/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { heldAssetsUnder } from './held-assets';
import { referrersOutside } from './referrers-outside';

/** The files that link to anything under these paths and are not under them themselves: the files a move or a trash of the paths touches. */
const referrerPaths = (paths: readonly string[]): readonly string[] => {
  const { workspaces } = useWorkspaceStore.getState();
  const found = referrersOutside(paths.flatMap(heldAssetsUnder)).flatMap((each) => {
    const path = workspaces[each.documentId]?.paths.get(each.key.id);
    return path === undefined ? [] : [path];
  });
  return [...new Set(found)];
};

export { referrerPaths };
