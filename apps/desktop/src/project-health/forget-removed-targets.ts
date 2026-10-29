/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from '../workspace/key-id';
import type { LinkIndex } from '../workspace/link-index.type';
import type { LinkFix } from './project-health.type';

const forgetRemovedTargets = (index: LinkIndex, removed: readonly LinkFix[]): void => {
  const { workspaces, patch } = useWorkspaceStore.getState();
  for (const fix of removed) {
    const file = index.files.find((each) => each.path === fix.file);
    const missing = !index.files.some((each) => each.assetId === fix.linkId);
    if (!file || file.kind === 'project' || !missing) continue;
    const key = keyId({ kind: file.kind, id: file.assetId });
    for (const workspace of Object.values(workspaces)) {
      if (!workspace.paths.has(file.assetId)) continue;
      patch(workspace.documentId, (each) => ({ ...each, unlinked: new Map([...each.unlinked, [key, new Set([...(each.unlinked.get(key) ?? []), fix.linkId])]]) }));
    }
  }
};

export { forgetRemovedTargets };
