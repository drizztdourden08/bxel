/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import type { LinkIndex } from '../workspace/link-index.type';
import type { LinkFix } from './project-health.type';

const forgetRemovedTargets = (index: LinkIndex, removed: readonly LinkFix[]): void => {
  const gone = [...new Set(removed.map((fix) => fix.linkId))].filter((id) => !index.files.some((file) => file.assetId === id));
  if (gone.length === 0) return;
  const { workspaces, patch } = useWorkspaceStore.getState();
  for (const workspace of Object.values(workspaces)) {
    if (gone.some((id) => workspace.paths.has(id))) {
      patch(workspace.documentId, (each) => ({ ...each, paths: new Map([...each.paths].filter(([id]) => !gone.includes(id))) }));
    }
  }
};

export { forgetRemovedTargets };
