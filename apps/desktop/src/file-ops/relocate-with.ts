/* @layer renderer-app @kind logic */
import { reasonOf } from '../files/reason-of';
import type { FileKit } from '../files/files.type';
import { useFileStore } from '../stores/useFileStore';
import { followFileRename } from '../workspace/follow-file-rename';
import { affectedBy } from './affected-by';
import type { OpOutcome, Relocation } from './file-ops.type';
import { heldAssetsUnder } from './held-assets';
import { rewriteLinks } from './rewrite-links';

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
