/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from '../workspace/key-id';
import { saveTab } from '../workspace/save-tab';
import { tabOf } from '../workspace/tab-of';
import type { HeldAsset } from './file-ops.type';

const rewriteReferrers = async (referrers: readonly Pick<HeldAsset, 'documentId' | 'key'>[]): Promise<number> => {
  const kit = fileKit();
  if (!kit) return 0;
  let written = 0;
  for (const referrer of referrers) {
    const workspace = useWorkspaceStore.getState().workspaces[referrer.documentId];
    if (!workspace || workspace.dirty.has(keyId(referrer.key)) || !workspace.paths.has(referrer.key.id)) continue;
    const outcome = await saveTab(kit, tabOf(referrer.documentId, referrer.key), false);
    if (outcome.kind === 'done') written += 1;
  }
  return written;
};

export { rewriteReferrers };
