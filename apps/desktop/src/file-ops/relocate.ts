/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { useFileStore } from '../stores/useFileStore';
import { followFileRename } from '../workspace/follow-file-rename';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { OpOutcome, Relocation } from './file-ops.type';
import { heldAssetsUnder } from './held-assets';
import { referrersOutside } from './referrers-outside';
import { rewriteReferrers } from './rewrite-referrers';

const relocate = async (moves: readonly Relocation[]): Promise<OpOutcome> => {
  const kit = fileKit();
  if (!kit) return { ok: false, message: FILE_OPS_TEXT.unavailable };
  const moved = moves.flatMap((move) => heldAssetsUnder(move.from));
  const referrers = referrersOutside(moved);
  try {
    for (const move of moves) {
      await kit.documents.rename(move.from, move.to);
      useFileStore.getState().retarget(move.from, move.to);
      followFileRename(move.from, move.to);
    }
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
  return { ok: true, rewritten: await rewriteReferrers(referrers) };
};

export { relocate };
