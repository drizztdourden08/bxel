/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { keyId } from '../workspace/key-id';
import { referrersOf } from '../workspace/referrers-of';
import type { HeldAsset } from './file-ops.type';

/** The assets that link to any of the given ones and are not among them. */
const referrersOutside = (moved: readonly HeldAsset[]): readonly Pick<HeldAsset, 'documentId' | 'key'>[] => {
  const inside = new Set(moved.map((each) => `${each.documentId}:${keyId(each.key)}`));
  const found = new Map<string, Pick<HeldAsset, 'documentId' | 'key'>>();
  const { views } = useDocumentStore.getState();
  for (const each of moved) {
    const artwork = views[each.documentId]?.state.artwork;
    if (!artwork) continue;
    for (const key of referrersOf(artwork, each.key)) {
      const id = `${each.documentId}:${keyId(key)}`;
      if (!inside.has(id)) found.set(id, { documentId: each.documentId, key });
    }
  }
  return [...found.values()];
};

export { referrersOutside };
