/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { deleteStep } from '../asset-list/delete-step';
import type { FileKit } from '../files/files.type';
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
import type { TrashResult } from './trash-paths.type';

const stillThere = async (kit: FileKit, path: string): Promise<boolean> => {
  const listing = await kit.documents.list(parentOf(path)).catch(() => null);
  return listing?.entries.some((entry) => entry.name.toLowerCase() === fileName(path).toLowerCase()) ?? false;
};

const trashPath = async (kit: FileKit, path: string): Promise<TrashResult> => {
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
    if (await stillThere(kit, target)) await kit.documents.trash(target);
    useFileStore.getState().retarget(target, null);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
};

export { trashPath };
