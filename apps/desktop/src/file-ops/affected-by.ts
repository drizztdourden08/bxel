/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from '../workspace/key-id';
import type { Affected, HeldAsset } from './file-ops.type';
import { referrersOutside } from './referrers-outside';

const affectedBy = (moved: readonly HeldAsset[]): readonly Affected[] => {
  const own = moved.map((each): Affected => ({ documentId: each.documentId, key: each.key, from: each.path, referrer: false }));
  const others = referrersOutside(moved).flatMap((each): Affected[] => {
    const path = useWorkspaceStore.getState().workspaces[each.documentId]?.paths.get(each.key.id);
    return path === undefined ? [] : [{ documentId: each.documentId, key: each.key, from: path, referrer: true }];
  });
  return [...new Map([...own, ...others].map((each) => [`${each.documentId}:${keyId(each.key)}`, each] as const)).values()];
};

export { affectedBy };
