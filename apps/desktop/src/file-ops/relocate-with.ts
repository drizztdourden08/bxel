/* @layer renderer-app @kind logic */
import { reasonOf } from '../files/reason-of';
import type { FileKit } from '../files/files.type';
import { useFileStore } from '../stores/useFileStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { followFileRename } from '../workspace/follow-file-rename';
import { keyId } from '../workspace/key-id';
import type { Affected, OpOutcome, Relocation } from './file-ops.type';
import { heldAssetsUnder } from './held-assets';
import { referrersOutside } from './referrers-outside';
import { rewriteLinks } from './rewrite-links';

const affectedBy = (moved: ReturnType<typeof heldAssetsUnder>): readonly Affected[] => {
  const own = moved.map((each): Affected => ({ documentId: each.documentId, key: each.key, from: each.path, referrer: false }));
  const others = referrersOutside(moved).flatMap((each): Affected[] => {
    const path = useWorkspaceStore.getState().workspaces[each.documentId]?.paths.get(each.key.id);
    return path === undefined ? [] : [{ documentId: each.documentId, key: each.key, from: path, referrer: true }];
  });
  return [...new Map([...own, ...others].map((each) => [`${each.documentId}:${keyId(each.key)}`, each] as const)).values()];
};

const relocateWith = async (kit: Pick<FileKit, 'documents'>, moves: readonly Relocation[]): Promise<OpOutcome> => {
  const affected = affectedBy(moves.flatMap((move) => heldAssetsUnder(move.from)));
  try {
    for (const move of moves) {
      await kit.documents.rename(move.from, move.to);
      useFileStore.getState().retarget(move.from, move.to);
      followFileRename(move.from, move.to);
    }
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
  return { ok: true, rewritten: await rewriteLinks(kit, moves, affected) };
};

export { relocateWith };
