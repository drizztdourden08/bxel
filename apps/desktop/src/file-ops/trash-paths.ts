/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { deleteStep } from '../asset-list/delete-step';
import { fileKit } from '../files/file-kit';
import { fileName } from '../files/file-name';
import { reasonOf } from '../files/reason-of';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';
import { runSteps } from '../transactions/run-steps';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { trashRemoved } from '../workspace/trash-removed';
import { FILE_OPS_TEXT } from './file-ops.constants';
import { heldAssetsUnder } from './held-assets';

type TrashResult = { readonly ok: true } | { readonly ok: false; readonly message: string };

const stillThere = async (path: string): Promise<boolean> => {
  const kit = fileKit();
  const listing = kit ? await kit.documents.list(parentOf(path)).catch(() => null) : null;
  return listing?.entries.some((entry) => entry.name.toLowerCase() === fileName(path).toLowerCase()) ?? false;
};

/**
 * Moves one file or folder to the system trash without asking. An asset the project holds is deleted from the project first, so the
 * project does not write the file back; the files that link to it keep a link that now shows as missing.
 */
const trashPath = async (path: string): Promise<TrashResult> => {
  const kit = fileKit();
  if (!kit) return { ok: false, message: FILE_OPS_TEXT.unavailable };
  const target = toSlashes(path);
  try {
    const held = heldAssetsUnder(target);
    for (const documentId of new Set(held.map((each) => each.documentId))) {
      const keys = held.filter((each) => each.documentId === documentId).map((each) => each.key);
      const steps = keys.flatMap((key) => deleteStep(key) ?? []) as readonly CommandStep[];
      const done = steps.length === 0 ? null : runSteps(useDocumentStore.getState().host, documentId, FILE_OPS_TEXT.trashLabel, steps);
      if (done !== null && !done.ok) return { ok: false, message: done.error.message };
      await trashRemoved({ ...kit, prompts: { ...kit.prompts, confirm: () => Promise.resolve(true) } }, documentId, keys);
    }
    if (await stillThere(target)) await kit.documents.trash(target);
    useFileStore.getState().retarget(target, null);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
};

export { trashPath };
